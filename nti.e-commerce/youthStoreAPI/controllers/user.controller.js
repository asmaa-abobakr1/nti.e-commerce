const User = require('../models/user.model');
const AppError = require('../utilites/appError.uti');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    // Filter out restricted fields like password, role
    const filteredBody = { ...req.body };
    delete filteredBody.password;
    delete filteredBody.role;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (err) { next(err); }
};

exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    
    // If it's the first address, make it default
    if (user.addresses.length === 1) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

exports.updateCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = req.body.cart; // Expecting full cart array
    await user.save();
    res.status(200).json({ status: 'success', data: { cart: user.cart } });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

// Admin CRUD
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ status: 'success', data: { users } });
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) return next(new AppError('No user found with that ID', 404));
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};
