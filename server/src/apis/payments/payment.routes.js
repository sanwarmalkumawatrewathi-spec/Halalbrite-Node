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
    getOrganizerTransactions,
    createLoginLink,
    verifyConnectStatus
} = require('../../controllers/payment.controller');
const { protect, authorize, optionalProtect } = require('../../middlewares/auth.middleware');

// Organizer Stripe Connect & Dashboard APIs
router.get('/stripe-login', protect, authorize('publish_events'), createLoginLink);
router.get('/connect', protect, authorize('publish_events'), connectStripe);
router.post('/connect/verify', protect, authorize('publish_events'), verifyConnectStatus);
router.get('/connect/status', protect, authorize('publish_events'), getConnectStatus);
router.post('/connect/disconnect', protect, authorize('publish_events'), disconnectStripe);
router.get('/callback', stripeCallback); // Public callback handled by Stripe
router.get('/organizer/stats', protect, authorize('publish_events'), getOrganizerStats);
router.get('/organizer/balance', protect, authorize('publish_events'), getOrganizerBalance);
router.get('/organizer/transactions', protect, authorize('publish_events'), getOrganizerTransactions);

// Ticket Purchase (Auth optional for guest checkout)
router.post('/checkout', (req, res, next) => {
    const { isGuest } = req.body;
    if (isGuest) return next();
    return protect(req, res, next);
}, createCheckoutSession);

// Ticket Management (Publicly accessible with booking ID for now, can be hardened later)
const { downloadTicket, resendTicketEmail, verifyBookingPayment } = require('../../controllers/payment.controller');
router.get('/booking/:id/download', downloadTicket);
router.post('/booking/:id/resend-email', resendTicketEmail);
router.post('/booking/:id/verify', verifyBookingPayment);

// Webhook (Handles raw body for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
