const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/setting.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public route to get active currencies for frontend
router.get('/public', getSettings); // Wait, getSettings has sensitive info.

// Better to add a specific public endpoint
const { getActiveCurrencies } = require('../../controllers/setting.controller');
router.get('/currencies', getActiveCurrencies);

// Admin only routes for global settings
router.route('/')
    .get(protect, authorize('administrator'), getSettings)
    .put(protect, authorize('administrator'), updateSettings);

module.exports = router;
