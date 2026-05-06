const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: false
    },
    recipient: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['attendee', 'organizer', 'admin', 'inquiry', 'general'],
        default: 'general'
    },
    subject: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    error: {
        type: String
    },
    messageId: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);
