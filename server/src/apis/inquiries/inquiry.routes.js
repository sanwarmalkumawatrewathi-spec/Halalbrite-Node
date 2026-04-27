const express = require('express');
const router = express.Router();
const { 
    submitInquiry, 
    getInquiries, 
    updateInquiry, 
    deleteInquiry 
} = require('../../controllers/inquiry.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public route for contact form
router.post('/', submitInquiry);

// Admin only routes for managing inquiries
router.get('/', protect, authorize('administrator'), getInquiries);
router.route('/:id')
    .put(protect, authorize('administrator'), updateInquiry)
    .delete(protect, authorize('administrator'), deleteInquiry);

module.exports = router;
