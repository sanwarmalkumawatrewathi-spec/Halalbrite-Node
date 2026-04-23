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
const { protect, authorize, optionalProtect } = require('../../middlewares/auth.middleware');

// Organizer Stripe Connect & Dashboard APIs
router.get('/connect', protect, authorize('organizer', 'administrator'), connectStripe);
router.get('/connect/status', protect, authorize('organizer', 'administrator'), getConnectStatus);
router.post('/connect/disconnect', protect, authorize('organizer', 'administrator'), disconnectStripe);
router.get('/callback', stripeCallback); // Public callback handled by Stripe
router.get('/organizer/stats', protect, authorize('organizer', 'administrator'), getOrganizerStats);
router.get('/organizer/balance', protect, authorize('organizer', 'administrator'), getOrganizerBalance);
router.get('/organizer/transactions', protect, authorize('organizer', 'administrator'), getOrganizerTransactions);

// Ticket Purchase (Auth optional for guest checkout)
router.post('/checkout', (req, res, next) => {
    const { isGuest } = req.body;
    if (isGuest) return next();
    return protect(req, res, next);
}, createCheckoutSession);

// Ticket Management (Publicly accessible with booking ID for now, can be hardened later)
const { downloadTicket, resendTicketEmail } = require('../../controllers/payment.controller');
router.get('/booking/:id/download', downloadTicket);
router.post('/booking/:id/resend-email', resendTicketEmail);

// Webhook (Handles raw body for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
