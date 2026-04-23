const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema({
    // Stripe API Settings
    stripe: {
        isTestMode: {
            type: Boolean,
            default: true
        },
        testSecretKey: String,
        testPublishableKey: String,
        testClientId: String,
        liveSecretKey: String,
        livePublishableKey: String,
        liveClientId: String,
        webhookSecret: String
    },
    // SMTP Email Settings
    smtp: {
        host: String,
        port: { type: Number, default: 587 },
        user: String,
        pass: String,
        fromEmail: String,
        fromName: { type: String, default: 'Halalbrite' }
    },
    // Auth0 Social Login Settings
    // Social Login Settings
    socialLogin: {
        google: {
            clientId: String,
            clientSecret: String,
            isActive: { type: Boolean, default: false }
        },
        meta: {
            clientId: String,
            clientSecret: String,
            isActive: { type: Boolean, default: false }
        },
        apple: {
            clientId: String,
            teamId: String,
            keyId: String,
            privateKey: String,
            isActive: { type: Boolean, default: false }
        }
    },
    // Platform Settings
    platform: {
        feePercentage: {
            type: Number,
            default: 0
        },
        fixedFee: {
            type: Number,
            default: 0
        },
        vatRate: {
            type: Number,
            default: 0
        },
        stripeFeePercentage: {
            type: Number,
            default: 3
        },
        fixedStripeFee: {
            type: Number,
            default: 0.3
        },
        currency: {
            type: String,
            default: 'EUR'
        },
        payoutThreshold: {
            type: Number,
            default: 1
        },
        payoutSchedule: {
            type: String,
            enum: ['Manual', 'Daily', 'Weekly', 'Monthly'],
            default: 'Manual'
        }
    },
    // Contact Information
    contactInfo: {
        officeAddress: String,
        contactEmail: String,
        businessHours: String
    },
    // Social Media Links
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        youtube: String
    },
    // Multi-Currency Settings
    currencies: [{
        code: { type: String, required: true },
        symbol: { type: String, required: true },
        rate: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
        country: String,
        countryCode: { type: String, required: true } // used for URL prefix: uk, us, au, ie
    }],
    lastCurrencySync: Date,
    // Webhook Settings
    webhookUrl: String,
    webhookEvents: [String]
}, { timestamps: true });

// Ensure only one setting document exists (singleton)
appSettingSchema.pre('save', async function() {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        if (count > 0) {
            throw new Error('Settings already exist. Use update instead.');
        }
    }
});

module.exports = mongoose.model('AppSetting', appSettingSchema);
