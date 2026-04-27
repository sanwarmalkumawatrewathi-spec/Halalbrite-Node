const express = require('express');
const router = express.Router();
const stripeController = require('../../controllers/adminStripe.controller');
const { protect } = require('../../middlewares/auth.middleware'); // Assuming protectAdmin exists for APIs

// All routes here are for Administrative REST API access
// Registered under /api/v1/admin/stripe

router.use(protect); // Secure all endpoints

router.get('/stats', stripeController.getStripeStatsAPI);
router.get('/organizers', stripeController.getStripeOrganizersAPI);
router.get('/transactions', stripeController.getStripeTransactionsAPI);

router.route('/settings')
    .get(stripeController.getStripeSettingsAPI)
    .post(stripeController.updateStripeSettingsAPI);

module.exports = router;
