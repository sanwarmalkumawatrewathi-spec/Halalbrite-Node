const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    booking_reference: {
        type: String,
        unique: true,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest checkout
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    // SQL Event Detail Snapshots
    event_name: String,
    event_date: Date,
    event_time: String,
    event_venue: String,
    event_location: String,

    ticket_id: String,
    ticket_name: String,
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    customer_name: String,
    customer_email: String,
    customer_phone: String,
    attendee_names: [String],
    
    // Address Fields
    address_line1: String,
    address_line2: String,
    city: String,
    postcode: String,
    country: { type: String, default: 'United Kingdom' },

    amount_total: {
        type: Number,
        required: true
    },
    base_amount_total: Number, // Amount in base currency (e.g. GBP)
    exchange_rate: { type: Number, default: 1 },
    organizer_amount: {
        type: Number,
        default: 0
    },
    platform_fee: {
        type: Number,
        default: 0
    },
    stripe_fee: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'GBP'
    },
    base_currency: { type: String, default: 'GBP' },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'free', 'cancelled', 'refunded'],
        default: 'pending'
    },
    stripe_session_id: String,
    stripe_payment_intent_id: String,
    stripe_charge_id: String,
    pdf_ticket_url: String,
    is_guest: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
