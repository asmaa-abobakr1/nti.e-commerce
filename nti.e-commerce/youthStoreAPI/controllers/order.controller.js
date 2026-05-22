const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');

exports.createOrder = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(new AppError('Admins cannot create orders', 403));
    }
    const { products, address } = req.body; // products: [{product: id, count: n}]

    // 1) Check stock for all products
    for (const item of products) {
      const prod = await Product.findById(item.product);
      if (!prod || prod.stock < item.count) {
        return next(new AppError(`Product ${prod ? prod.title : item.product} is out of stock!`, 400));
      }
    }

    // 2) Decrement stock and calculate total
    let totalPrice = 0;
    const orderProducts = [];
    
    for (const item of products) {
      const prod = await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.count }
      }, { returnDocument: 'after' });
      
      orderProducts.push({
        product: prod._id,
        price: prod.price, // Snapshot
        count: item.count
      });
      totalPrice += prod.price * item.count;
    }

    // 3) Create Order
    const newOrder = await Order.create({
      user: req.user.id,
      products: orderProducts,
      totalPrice,
      address,
      status: 'pending'
    });

    // 4) Clear User Cart
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.status(201).json({ status: 'success', data: { order: newOrder } });
  } catch (err) { next(err); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort('-createdAt');
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (err) { next(err); }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.product')
      .sort('-createdAt');
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    let order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { returnDocument: 'after' });
    // Populate product details for order components
    order = await Order.findById(order._id).populate('products.product');
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));
    
    // User can cancel if pending or prepared
    if (order.status !== 'pending' && order.status !== 'preparing') {
      return next(new AppError('Order cannot be canceled at this stage', 400));
    }

    order.status = 'cancelbyuser';
    
    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.count } });
    }

    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

exports.requestRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.status !== 'delivered') {
      return next(new AppError('Only delivered orders can be refunded', 400));
    }
    await Order.findByIdAndUpdate(req.params.id, { refundStatus: 'requested' }, { returnDocument: 'after' });
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

exports.approveRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (req.body.approved) {
      order.refundStatus = 'approved';
      // Restore stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.count } });
      }
    } else {
      order.refundStatus = 'rejected';
    }
    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      // Restore stock for each product in the order
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.count } });
      }
    }
    await Order.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
