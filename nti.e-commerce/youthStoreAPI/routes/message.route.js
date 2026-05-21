const express = require('express');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public route for sending messages
router.post('/', messageController.createMessage);

// Admin only routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', messageController.getAllMessages);
router.patch('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
