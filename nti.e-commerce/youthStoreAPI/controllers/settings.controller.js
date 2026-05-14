const Settings = require('../models/settings.model');

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Create default if not exists
    }
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: { settings } });
  } catch (err) { next(err); }
};
