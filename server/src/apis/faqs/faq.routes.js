const express = require('express');
const router = express.Router();
const { 
    getFAQs, 
    getFAQsByCategory, 
    createFAQ, 
    updateFAQ, 
    deleteFAQ 
} = require('../../controllers/faq.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public routes for viewing FAQs
router.get('/', getFAQs);
router.get('/category/:category', getFAQsByCategory);

// Admin only routes for managing FAQs
router.post('/', protect, authorize('administrator'), createFAQ);
router.route('/:id')
    .put(protect, authorize('administrator'), updateFAQ)
    .delete(protect, authorize('administrator'), deleteFAQ);

module.exports = router;
