const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'eur'
    },
    destination: String,
    fee: {
        type: Number,
        default: 0
    },
    net_amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'canceled'],
        default: 'pending'
    },
    payout_id: String,
    transfer_id: String,
    paid_date: Date,
    failure_code: String,
    failure_message: String,
    metadata: {
        type: Map,
        of: String
    },
    description: String,
    arrival_date: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Payout', payoutSchema);
