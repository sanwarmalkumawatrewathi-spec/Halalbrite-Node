const express = require('express');
const router = express.Router();
const { 
    connectStripe, 
    getConnectStatus,
    disconnectStripe,
    stripeCallback, 
    createCheckoutSession,
    handleWebhook,
    getOrganizerStats,
    getOrganizerBalance,
    getOrganizerTransactions
} = require('../../controllers/payment.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Organizer Stripe Connect & Dashboard APIs
router.get('/connect', protect, authorize('organizer', 'administrator'), connectStripe);
router.get('/connect/status', protect, authorize('organizer', 'administrator'), getConnectStatus);
router.post('/connect/disconnect', protect, authorize('organizer', 'administrator'), disconnectStripe);
router.get('/callback', stripeCallback); // Public callback handled by Stripe
router.get('/organizer/stats', protect, authorize('organizer', 'administrator'), getOrganizerStats);
router.get('/organizer/balance', protect, authorize('organizer', 'administrator'), getOrganizerBalance);
router.get('/organizer/transactions', protect, authorize('organizer', 'administrator'), getOrganizerTransactions);

// Ticket Purchase
router.post('/checkout', protect, createCheckoutSession);

// Webhook (Handles raw body for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
