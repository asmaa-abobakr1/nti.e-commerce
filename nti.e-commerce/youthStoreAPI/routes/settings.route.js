const express = require('express');
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', settingsController.getSettings);

// Admin only
router.patch('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), settingsController.updateSettings);

module.exports = router;
