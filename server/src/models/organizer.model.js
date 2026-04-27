const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    categories: [{
        type: String
    }],
    logo: String,
    socialLinks: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Organizer', organizerSchema);
