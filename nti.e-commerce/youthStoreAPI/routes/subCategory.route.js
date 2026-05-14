const express = require('express');
const subCategoryController = require('../controllers/subCategory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', subCategoryController.getAllSubCategories);

// Admin only
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', subCategoryController.createSubCategory);
router.patch('/:id', subCategoryController.updateSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
