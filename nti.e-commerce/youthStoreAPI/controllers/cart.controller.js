const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.status(200).json({ status: 'success', data: { cart: user.cart } });
  } catch (err) { next(err); }
};

exports.updateCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = req.body.cart;
    await user.save();
    res.status(200).json({ status: 'success', data: { cart: user.cart } });
  } catch (err) { next(err); }
};
