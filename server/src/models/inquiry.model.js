const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    adminNotes: String,
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Can be User or Organizer depending on context
    },
    type: {
        type: String,
        enum: ['general', 'organizer'],
        default: 'general'
    }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
