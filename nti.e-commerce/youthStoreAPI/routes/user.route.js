const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.patch('/updateCart', userController.updateCart);

router.post('/address', userController.addAddress);
router.patch('/address/:id/default', userController.setDefaultAddress);
router.delete('/address/:id', userController.deleteAddress);

// Admin only
router.use(authMiddleware.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
