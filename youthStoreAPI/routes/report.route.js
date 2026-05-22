const express = require('express');
const reportController = require('../controllers/reports.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/sales', reportController.getSalesReport);

module.exports = router;
