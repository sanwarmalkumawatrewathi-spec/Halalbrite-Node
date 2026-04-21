const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const AppSetting = require('../server/src/models/appSetting.model');
const stripeService = require('../server/src/services/stripe.service');

async function sync() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        console.log('Syncing rates with Stripe...');
        const rates = await stripeService.syncCurrencyRates();
        console.log('✅ Rates synced successfully:', JSON.stringify(rates, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

sync();
