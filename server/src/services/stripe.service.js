const stripe = require('stripe');
const AppSetting = require('../models/appSetting.model');
const User = require('../models/user.model');

/**
 * Service to handle all Stripe-related operations.
 * Centralizing this logic ensures consistent configuration and error handling.
 */

class StripeService {
    /**
     * Get an initialized Stripe instance based on current settings.
     */
    async getStripeInstance() {
        const settings = await AppSetting.findOne();
        if (!settings) throw new Error('Global app settings not configured');

        const secretKey = settings.stripe.isTestMode
            ? settings.stripe.testSecretKey
            : settings.stripe.liveSecretKey;

        if (!secretKey) throw new Error('Stripe Secret Key not found in settings');

        return stripe(secretKey, {
            apiVersion: '2023-10-16'
        });
    }

    /**
     * Generate the Onboarding URL for an organizer to connect their Stripe account.
     * Uses the modern "Express" Connect flow via Account Links.
     */
    async getConnectUrl(user) {
        const stripeInstance = await this.getStripeInstance();
        
        // 1. Create a new Express account if they don't have one
        let accountId = user.stripeConnectedId;
        
        if (!accountId) {
            const account = await stripeInstance.accounts.create({
                type: 'express',
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: {
                    userId: user._id.toString(),
                }
            });
            accountId = account.id;
            
            // Save immediately
            await User.findByIdAndUpdate(user._id, { stripeConnectedId: accountId });
        }

        // 2. Generate Account Link
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        const accountLink = await stripeInstance.accountLinks.create({
            account: accountId,
            refresh_url: `${baseUrl}/OrganiserDashboard?status=stripe_refresh`,
            return_url: `${baseUrl}/OrganiserDashboard?status=stripe_success`,
            type: 'account_onboarding',
        });

        return accountLink.url;
    }

    /**
     * Create an Account Link for an Express account to finish onboarding or update details.
     */
    async createAccountLink(accountId, type = 'account_onboarding') {
        const stripeInstance = await this.getStripeInstance();
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        return await stripeInstance.accountLinks.create({
            account: accountId,
            refresh_url: `${baseUrl}/OrganiserDashboard?status=refresh`,
            return_url: `${baseUrl}/OrganiserDashboard?status=success`,
            type: type,
        });
    }

    /**
     * Exchanges OAuth code for a permanent Stripe Account ID and sets up the account.
     */
    async handleOAuthCallback(code) {
        const stripeInstance = await this.getStripeInstance();
        const response = await stripeInstance.oauth.token({
            grant_type: 'authorization_code',
            code,
        });
        return response.stripe_user_id;
    }

    /**
     * Retrieves account balance for a connected account.
     */
    async getAccountBalance(accountId) {
        console.log(`🏦 Fetching balance for Stripe Account: ${accountId}`);
        const stripeInstance = await this.getStripeInstance();
        // Use stripeAccount (camelCase) for the options object in latest Stripe SDK
        return await stripeInstance.balance.retrieve({}, {
            stripeAccount: accountId
        });
    }

    /**
     * Generates a single-use login link for the Stripe Express Dashboard.
     */
    async createLoginLink(accountId) {
        const stripeInstance = await this.getStripeInstance();
        return await stripeInstance.accounts.createLoginLink(accountId);
    }

    /**
     * Construct a Webhook event from the raw body and signature.
     */
    async constructEvent(body, signature) {
        const stripeInstance = await this.getStripeInstance();
        const settings = await AppSetting.findOne();
        const webhookSecret = settings.stripe?.webhookSecret;

        // In development, if secret is missing or signature is missing, allow manual testing
        if (process.env.NODE_ENV === 'development' && (!webhookSecret || !signature)) {
            console.log('⚠️ Stripe Webhook: Bypassing signature verification (Development Mode)');
            // If body is already a JSON object (from Postman), return it. 
            // If it's a buffer, parse it.
            return typeof body === 'string' ? JSON.parse(body) : (Buffer.isBuffer(body) ? JSON.parse(body.toString()) : body);
        }

        if (!webhookSecret) throw new Error('Stripe Webhook Secret not configured');

        return stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
    }

    /**
     * Get platform-wide Stripe statistics.
     */
    async getDashboardStats() {
        const stripeInstance = await this.getStripeInstance();
        const Transaction = require('../models/transaction.model');
        const Payout = require('../models/payout.model');

        // Total Tickets Sold (Sale transactions)
        const ticketsSold = await Transaction.countDocuments({ type: 'sale', status: 'completed' });

        // Platform Revenue (Sum of platform fees converted to base currency)
        const revenueStats = await Transaction.aggregate([
            { $match: { status: 'completed', type: 'sale' } },
            { $group: { _id: null, total: { $sum: { $divide: ['$platform_fee', '$exchange_rate'] } } } }
        ]);

        // Total Payouts (Processed payouts)
        const payoutStats = await Payout.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        return {
            ticketsSold,
            platformRevenue: revenueStats[0]?.total || 0,
            totalPayouts: payoutStats[0]?.total || 0
        };
    }

    /**
     * Sync historical transfers/payouts from Stripe to keep local DB fresh.
     */
    async syncPayouts(limit = 100) {
        const stripeInstance = await this.getStripeInstance();
        const Payout = require('../models/payout.model');
        const Transaction = require('../models/transaction.model');
        const User = require('../models/user.model');

        let syncedTransfers = 0;
        let syncedPayouts = 0;
        let organizersProcessed = 0;

        // 1. Fetch Transfers (Platform -> Organizer)
        const transfers = await stripeInstance.transfers.list({ limit });
        for (const t of transfers.data) {
            const exists = await Transaction.findOne({ stripeTransferId: t.id });
            if (!exists) {
                // Find organizer by stripe account id
                const organizer = await User.findOne({ stripeConnectedId: t.destination });
                if (organizer) {
                    await Transaction.create({
                        organizer_id: organizer._id,
                        event_id: null,
                        type: 'payout',
                        amount: t.amount / 100,
                        platform_fee: 0,
                        organizer_amount: t.amount / 100,
                        currency: t.currency.toUpperCase(),
                        status: 'completed',
                        stripe_transfer_id: t.id
                    });
                    syncedTransfers++;
                }
            }
        }

        // 2. Fetch Payouts (Organizer -> Bank) - Required for each connected account
        const connectedUsers = await User.find({ stripeConnectedId: { $ne: null } });
        for (const user of connectedUsers) {
            organizersProcessed++;
            try {
                const payouts = await stripeInstance.payouts.list(
                    { limit: 20 },
                    { stripe_account: user.stripeConnectedId }
                );
                for (const p of payouts.data) {
                    const exists = await Payout.findOne({ stripePayoutId: p.id });
                    if (!exists) {
                        await Payout.create({
                            userId: user._id,
                            amount: p.amount / 100,
                            currency: p.currency.toUpperCase(),
                            status: p.status === 'paid' ? 'paid' : 'pending',
                            stripePayoutId: p.id,
                            arrivalDate: new Date(p.arrival_date * 1000)
                        });
                        syncedPayouts++;
                    }
                }
            } catch (err) {
                console.error(`Sync error for ${user.stripeConnectedId}:`, err.message);
            }
        }

        return { 
            syncedTransfers, 
            syncedPayouts, 
            organizersProcessed 
        };
    }

    /**
     * Get latest exchange rates from Stripe.
     */
    async getExchangeRates(baseCurrency = 'eur') {
        const stripeInstance = await this.getStripeInstance();
        try {
            // Stripe returns rates relative to the requested currency
            let baseRates;
            try {
                const ratesList = await stripeInstance.exchangeRates.list({ limit: 100 });
                baseRates = ratesList.data.find(r => r.id === baseCurrency.toLowerCase());
            } catch (stripeErr) {
                console.warn('⚠️ Stripe Exchange Rates API not available on this account. Using fallback provider...');
                // Fallback to a public API
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.toUpperCase()}`);
                const data = await response.json();
                return data.rates;
            }
            
            if (!baseRates) {
                // If stripe rates for EUR aren't found, try to get rates for other currencies and invert
                const allRates = await stripeInstance.exchangeRates.list({ limit: 100 });
                const rateToEur = allRates.data.find(r => r.id === 'eur');
                if (rateToEur) return rateToEur.rates;
                
                throw new Error(`Could not find exchange rates for base currency: ${baseCurrency}`);
            }
            
            return baseRates.rates;
        } catch (err) {
            console.error(`❌ Exchange Rate Error: ${err.message}`);
            // Last resort: hardcoded semi-accurate rates
            return {
                "usd": 1.25,
                "eur": 1.15,
                "aud": 1.9,
                "gbp": 1
            };
        }
    }

    /**
     * Sync local currency rates with Stripe.
     */
    async syncCurrencyRates() {
        const AppSetting = require('../models/appSetting.model');
        const settings = await AppSetting.findOne();
        if (!settings) throw new Error('Settings not found');

        const baseCurrency = settings.platform.currency || 'EUR';
        const rates = await this.getExchangeRates(baseCurrency);

        // Normalize rates keys to lowercase for consistent lookup
        const normalizedRates = {};
        Object.keys(rates).forEach(k => normalizedRates[k.toLowerCase()] = rates[k]);

        // Update rates for active currencies
        settings.currencies.forEach(curr => {
            const code = curr.code.toLowerCase();
            if (normalizedRates[code]) {
                curr.rate = normalizedRates[code];
            }
        });

        settings.lastCurrencySync = new Date();
        await settings.save();
        return settings.currencies;
    }

    async ensureFreshRates() {
        try {
            const settings = await require('../models/appSetting.model').findOne();
            if (!settings) return;

            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            if (!settings.lastCurrencySync || settings.lastCurrencySync < tenMinutesAgo) {
                console.log('🔄 Real-time syncing currency rates from Stripe...');
                await this.syncCurrencyRates();
            }
        } catch (error) {
            console.error('❌ Auto-sync Currency Error:', error.message);
        }
    }

    /**
     * Create a Stripe Checkout Session for a ticket purchase.
     */
    async createCheckoutSession(params) {
        const stripeInstance = await this.getStripeInstance();
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        const sessionData = {
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: params.currency.toLowerCase(),
                    product_data: {
                        name: params.ticketName,
                        description: `Ticket for ${params.eventName}`,
                        images: params.eventBanner ? [params.eventBanner] : [],
                    },
                    unit_amount: Math.round(params.amount * 100),
                },
                quantity: params.quantity,
            }],
            mode: 'payment',
            success_url: `${baseUrl}/checkout/success?status=success&bookingId=${params.bookingId}`,
            cancel_url: `${baseUrl}/eventpage/${params.eventId}?status=cancelled`,
            customer_email: params.customerEmail,
            metadata: {
                bookingId: params.bookingId,
                eventId: params.eventId,
                ticketType: params.ticketName,
            },
            payment_intent_data: {
                metadata: {
                    bookingId: params.bookingId,
                    eventId: params.eventId,
                }
            }
        };

        return await stripeInstance.checkout.sessions.create(sessionData);
    }
}

module.exports = new StripeService();
