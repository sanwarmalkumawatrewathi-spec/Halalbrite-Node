const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    eventType: {
        type: String,
        required: true,
        enum: ['Online', 'In Person', 'online', 'in-person'],
        default: 'In Person'
    },
    banner: {
        type: String,
        default: '/placeholder-event.jpg'
    },
    thumbnail: {
        type: String,
        default: '/placeholder-thumbnail.jpg'
    },
    thumbnailOption: {
        type: String,
        enum: ['same', 'different'],
        default: 'same'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: String,
    endTime: String,
    meetingLink: String, // For online events
    price: {
        type: Number,
        default: 0 // 0 means Free
    },
    priceLabel: {
        type: String, // e.g., "From £25"
        default: 'Free'
    },
    location: {
        venueName: String,
        address: String,
        city: String,
        state: String,
        postcode: String,
        country: { type: String, default: 'UK' },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: false
            }
        }
    },
    ticketTypes: [{
        name: { type: String, required: true },
        description: String,
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        saleStart: Date,
        saleEnd: Date,
        platformFee: { type: Number, default: 0 },
        vatOnPlatformFee: { type: Number, default: 0 },
        stripeProcessingFee: { type: Number, default: 0 },
        totalFees: { type: Number, default: 0 }
    }],
    feePayment: {
        type: Boolean,
        default: false // false = buyer pays, true = organizer pays (based on typical toggle patterns)
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizerName: String, // Denormalized for faster listing
    capacity: Number,
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'published'
    }
}, { timestamps: true });

// Pre-save hook to handle geo-spatial indexing
eventSchema.pre('save', async function() {
    // If location exists but geometry coordinates are missing, remove geometry
    if (this.location && this.location.geometry) {
        if (!this.location.geometry.coordinates || this.location.geometry.coordinates.length === 0) {
            this.set('location.geometry', undefined);
        }
    }
});

// Index for geo-spatial queries (sparse allows saving events without coordinates)
eventSchema.index({ "location.geometry": "2dsphere" }, { sparse: true });

module.exports = mongoose.model('Event', eventSchema);
