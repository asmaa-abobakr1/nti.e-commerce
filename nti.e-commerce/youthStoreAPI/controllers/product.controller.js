const Product = require('../models/product.model');
const AppError = require('../utilites/appError.uti');

exports.getAllProducts = async (req, res, next) => {
  try {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering (price range)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Product.find(JSON.parse(queryStr)).populate('category subCategory');

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // 4) Execution
    const products = await query;

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category subCategory');
    if (!product) return next(new AppError('No product found with that ID', 404));
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return next(new AppError('No product found with that ID', 404));
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // Soft delete
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!product) return next(new AppError('No product found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
