const Booking = require('../models/booking.model');
const stripeService = require('../services/stripe.service');
const { handleTicketDelivery, verifyPendingBookings } = require('./payment.controller');

// @desc    Get user's tickets (bookings)
// @route   GET /api/bookings/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
    try {
        let bookings = await Booking.find({ user_id: req.user._id })
            .sort({ createdAt: -1 }); // Use createdAt as per typically modern schemas
        
        // Auto-verify any pending bookings in the list
        await verifyPendingBookings(bookings);

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('event_id');
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // On-the-fly verification for pending bookings
        if (booking.payment_status === 'pending' && booking.stripe_session_id) {
            try {
                const stripeInstance = await stripeService.getStripeInstance();
                const session = await stripeInstance.checkout.sessions.retrieve(booking.stripe_session_id);
                
                if (session.payment_status === 'paid') {
                    booking.payment_status = 'paid';
                    booking.stripe_payment_intent_id = session.payment_intent;
                    await booking.save();
                    await handleTicketDelivery(booking);
                }
            } catch (err) { console.error('Verification error in getBookingById:', err.message); }
        }

        // Ensure user owns this booking (if not guest)
        if (booking.user_id && (!req.user || booking.user_id.toString() !== req.user._id.toString())) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

