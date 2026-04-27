const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: false
    },
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    },
    type: {
        type: String,
        enum: ['sale', 'refund', 'payout'],
        default: 'sale'
    },
    amount: {
        type: Number,
        required: true // Gross amount
    },
    base_amount: Number, // Gross amount in base currency
    exchange_rate: { type: Number, default: 1 },
    platform_fee: {
        type: Number,
        default: 0
    },
    organizer_amount: {
        type: Number,
        required: true // Net for organizer
    },
    currency: {
        type: String,
        default: 'GBP'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transaction_id: String, // Stripe ID or Internal ID
    stripe_session_id: String,
    stripe_payment_intent_id: String,
    stripe_transfer_id: String,
    stripe_charge_id: String,
    description: String,
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
