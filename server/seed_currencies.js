const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const AppSetting = require('./src/models/appSetting.model');

async function seedCurrencies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        
        let settings = await AppSetting.findOne();
        if (!settings) {
            settings = new AppSetting();
        }

        const defaultCurrencies = [
            { code: 'EUR', symbol: '€', rate: 1.0, isActive: true, country: 'European Union', countryCode: 'eu' },
            { code: 'GBP', symbol: '£', rate: 0.85, isActive: true, country: 'United Kingdom', countryCode: 'uk' },
            { code: 'USD', symbol: '$', rate: 1.1, isActive: true, country: 'United States', countryCode: 'us' }
        ];

        settings.currencies = defaultCurrencies;
        settings.platform.currency = 'EUR';
        
        await settings.save();
        console.log('✅ Currencies seeded successfully:', defaultCurrencies.map(c => c.code).join(', '));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

seedCurrencies();
