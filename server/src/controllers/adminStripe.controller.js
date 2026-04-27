const stripeService = require('../services/stripe.service');
const AppSetting = require('../models/appSetting.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

/**
 * REST API Controller for Stripe Connect Administration
 * Returns JSON responses suitable for Next.js or Postman
 */

// @desc    Get Stripe Dashboard Statistics (JSON)
// @route   GET /api/v1/admin/stripe/stats
exports.getStripeStatsAPI = async (req, res) => {
    try {
        const stats = await stripeService.getDashboardStats();
        const connectedOrganizers = await User.countDocuments({ stripeConnectedId: { $ne: null } });
        
        res.status(200).json({
            success: true,
            data: {
                ...stats,
                connectedOrganizers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Stripe & Platform Settings (JSON)
// @route   GET /api/v1/admin/stripe/settings
exports.getStripeSettingsAPI = async (req, res) => {
    try {
        const settings = await AppSetting.findOne();
        if (!settings) return res.status(404).json({ success: false, message: 'Settings not found' });

        // Masking secret keys for security in JSON response
        const maskedStripe = { ...settings.stripe.toObject() };
        if (maskedStripe.testSecretKey) maskedStripe.testSecretKey = '••••••••';
        if (maskedStripe.liveSecretKey) maskedStripe.liveSecretKey = '••••••••';
        if (maskedStripe.webhookSecret) maskedStripe.webhookSecret = '••••••••';

        res.status(200).json({
            success: true,
            data: {
                stripe: maskedStripe,
                platform: settings.platform
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Stripe & Platform Settings (JSON)
// @route   POST /api/v1/admin/stripe/settings
exports.updateStripeSettingsAPI = async (req, res) => {
    try {
        const settings = await AppSetting.findOne() || new AppSetting();
        const { stripe, platform } = req.body;

        if (stripe) {
            settings.stripe = { ...settings.stripe, ...stripe };
        }
        if (platform) {
            settings.platform = { ...settings.platform, ...platform };
        }

        await settings.save();
        res.status(200).json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Connected Organizers List (JSON)
// @route   GET /api/v1/admin/stripe/organizers
exports.getStripeOrganizersAPI = async (req, res) => {
    try {
        const organizers = await User.find({ stripe_account_id: { $ne: null } })
            .select('username email stripe_account_id charges_enabled payouts_enabled verification_status createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: organizers.length,
            data: organizers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Platform Transactions (JSON)
// @route   GET /api/v1/admin/stripe/transactions
exports.getStripeTransactionsAPI = async (req, res) => {
    try {
        const { organizer, limit = 50 } = req.query;
        const query = organizer ? { organizerId: organizer } : {};

        const transactions = await Transaction.find(query)
            .populate('organizerId', 'username email')
            .populate('eventId', 'title')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
