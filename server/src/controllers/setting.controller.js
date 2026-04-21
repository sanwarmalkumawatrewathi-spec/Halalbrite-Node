const AppSetting = require('../models/appSetting.model');
const crypto = require('crypto');

// Helper to mask sensitive keys
const maskKey = (key) => {
    if (!key) return '';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 7)}••••••••${key.substring(key.length - 4)}`;
};

// @desc    Get global settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
    try {
        let settings = await AppSetting.findOne();
        
        // If no settings exist, create default ones
        if (!settings) {
            settings = await AppSetting.create({});
        }

        // Mask sensitive keys before sending to frontend
        const maskedSettings = settings.toObject();
        if (maskedSettings.stripe) {
            maskedSettings.stripe.testSecretKey = maskKey(maskedSettings.stripe.testSecretKey);
            maskedSettings.stripe.liveSecretKey = maskKey(maskedSettings.stripe.liveSecretKey);
            maskedSettings.stripe.webhookSecret = maskKey(maskedSettings.stripe.webhookSecret);
        }

        res.json({
            message: 'Settings fetched successfully',
            data: maskedSettings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update global settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        let settings = await AppSetting.findOne();
        
        const updateData = { ...req.body };

        // 1. Masking logic for secret keys
        if (updateData.stripe) {
            if (updateData.stripe.testSecretKey && (updateData.stripe.testSecretKey.includes('•') || updateData.stripe.testSecretKey.includes('*'))) {
                delete updateData.stripe.testSecretKey;
            }
            if (updateData.stripe.liveSecretKey && (updateData.stripe.liveSecretKey.includes('•') || updateData.stripe.liveSecretKey.includes('*'))) {
                delete updateData.stripe.liveSecretKey;
            }
            if (updateData.stripe.webhookSecret && (updateData.stripe.webhookSecret.includes('•') || updateData.stripe.webhookSecret.includes('*'))) {
                delete updateData.stripe.webhookSecret;
            }
        }

        if (!settings) {
            settings = await AppSetting.create(updateData);
        } else {
            // Use Mongoose's built-in merging for nested objects
            Object.keys(updateData).forEach(key => {
                if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
                    settings[key] = { ...settings[key], ...updateData[key] };
                } else {
                    settings[key] = updateData[key];
                }
            });
            await settings.save();
        }
        
        // Return masked version
        const maskedSettings = settings.toObject();
        if (maskedSettings.stripe) {
            maskedSettings.stripe.testSecretKey = maskKey(maskedSettings.stripe.testSecretKey);
            maskedSettings.stripe.liveSecretKey = maskKey(maskedSettings.stripe.liveSecretKey);
            maskedSettings.stripe.webhookSecret = maskKey(maskedSettings.stripe.webhookSecret);
        }

        res.json({
            message: 'Settings updated successfully',
            data: maskedSettings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active currencies for frontend
// @route   GET /api/admin/settings/currencies
// @access  Public
exports.getActiveCurrencies = async (req, res) => {
    try {
        const settings = await AppSetting.findOne();
        if (!settings) return res.status(404).json({ message: 'Settings not found' });
        
        const activeCurrencies = (settings.currencies || []).filter(c => c.isActive).map(c => ({
            code: c.code,
            symbol: c.symbol,
            rate: c.rate,
            country: c.country,
            countryCode: c.countryCode
        }));
        
        res.json({
            success: true,
            baseCurrency: settings.platform.currency || 'GBP',
            currencies: activeCurrencies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get public social login settings for frontend
// @route   GET /api/admin/settings/social
// @access  Public
exports.getPublicSocialSettings = async (req, res) => {
    try {
        const settings = await AppSetting.findOne();
        if (!settings || !settings.socialLogin) {
            return res.status(404).json({ message: 'Social settings not found' });
        }
        
        const social = settings.socialLogin;
        const publicSettings = {
            google: {
                clientId: social.google.isActive ? social.google.clientId : null,
                isActive: social.google.isActive
            },
            meta: {
                appId: social.meta.isActive ? social.meta.clientId : null, // Meta uses clientId as AppId usually
                isActive: social.meta.isActive
            },
            apple: {
                clientId: social.apple.isActive ? social.apple.clientId : null,
                isActive: social.apple.isActive
            }
        };
        
        res.json({
            success: true,
            data: publicSettings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
