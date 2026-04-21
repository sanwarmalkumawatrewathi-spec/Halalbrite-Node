const express = require('express');
const router = express.Router();
const { 
    getPages, 
    getPageBySlug, 
    createPage, 
    updatePage, 
    deletePage 
} = require('../../controllers/page.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', getPages);
router.get('/:slug', getPageBySlug);

// Admin only routes
router.post('/', protect, authorize('administrator'), createPage);
router.put('/:id', protect, authorize('administrator'), updatePage);
router.delete('/:id', protect, authorize('administrator'), deletePage);

module.exports = router;
