const Testimonial = require('../models/testimonial.model');
const AppError = require('../utilites/appError.uti');

exports.submitTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ status: 'success', data: { testimonial } });
  } catch (err) { next(err); }
};

exports.getApprovedTestimonials = async (req, res, next) => {
  try {
    // Sorting: stars, date, name
    const testimonials = await Testimonial.find({ isApproved: 1 })
      .sort('-stars -date name');
    res.status(200).json({ status: 'success', data: { testimonials } });
  } catch (err) { next(err); }
};

exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.status(200).json({ status: 'success', data: { testimonials } });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { isApproved, isFeaturedInSlider } = req.body;
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeaturedInSlider !== undefined) updateData.isFeaturedInSlider = isFeaturedInSlider;

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ status: 'success', data: { testimonial } });
  } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};
