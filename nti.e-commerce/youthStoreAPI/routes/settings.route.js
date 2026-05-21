const express = require('express');
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', settingsController.getSettings);

// Admin only
router.patch('/', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('admin'), 
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'marketingImages', maxCount: 10 }
  ]), 
  settingsController.updateSettings
);

module.exports = router;
