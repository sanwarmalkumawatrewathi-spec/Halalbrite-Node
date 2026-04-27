const Booking = require('../models/booking.model');

// @desc    Get user's tickets (bookings)
// @route   GET /api/bookings/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.user._id })
            .sort({ created_at: -1 });
        
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
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Ensure user owns this booking (if not guest)
        if (booking.user_id && (!req.user || booking.user_id.toString() !== req.user._id.toString())) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
