const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Social login users won't have a local password
    },
    auth0Id: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    metaId: {
        type: String,
        unique: true,
        sparse: true
    },
    appleId: {
        type: String,
        unique: true,
        sparse: true
    },
    isSocialLogin: {
        type: Boolean,
        default: false
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }],
    firstName: String,
    lastName: String,
    avatar: String,
    phone: String,
    bio: String,
    addresses: [{
        label: String, // e.g., "Home", "Office"
        street: String,
        city: String,
        state: String,
        postcode: String,
        country: { type: String, default: 'UK' },
        isDefault: { type: Boolean, default: false }
    }],
    savedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    followedOrganizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    preferences: {
        eventUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        newsletter: { type: Boolean, default: true }
    },
    stripe_account_id: String, // Legacy acct_...
    stripeConnectedId: String, // Modern Connect acct_...
    stripe_account_email: String,
    stripe_customer_id: String, // cus_...
    
    // Stripe Connect Replica Fields
    account_country: String,
    account_currency: String,
    account_type: { type: String, default: 'express' },
    charges_enabled: { type: Boolean, default: false },
    payouts_enabled: { type: Boolean, default: false },
    access_token: String,
    refresh_token: String,
    connection_status: { type: String, default: 'pending' },
    connection_date: { type: Date, default: Date.now },
    verification_status: { type: String, default: 'unverified' },
    capabilities: String, // Long text
    requirements: [String],
    metadata: {
        type: Map,
        of: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
