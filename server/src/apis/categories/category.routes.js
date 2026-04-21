const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../../controllers/category.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

router.get('/', getCategories);

// Protected routes for Admins
router.post('/', protect, authorize('manage_options'), createCategory);
router.put('/:id', protect, authorize('manage_options'), updateCategory);
router.delete('/:id', protect, authorize('manage_options'), deleteCategory);

module.exports = router;
