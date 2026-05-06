const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getActiveCurrencies, getPublicSocialSettings, getPublicFeeSettings } = require('../../controllers/setting.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public routes MUST come before routes with parameters or restricted routes
router.get('/currencies', getActiveCurrencies);
router.get('/social-settings', getPublicSocialSettings);
router.get('/fees', getPublicFeeSettings);
router.get('/public', getSettings);

// Admin only routes for global settings
router.route('/')
    .get(protect, authorize('administrator'), getSettings)
    .put(protect, authorize('administrator'), updateSettings);

module.exports = router;
