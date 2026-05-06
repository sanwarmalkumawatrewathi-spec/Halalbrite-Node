const mongoose = require('mongoose');
require('dotenv').config();
const AppSetting = require('./src/models/appSetting.model');

async function checkSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const settings = await AppSetting.findOne();
        console.log('Stripe Settings:');
        console.log(JSON.stringify(settings.stripe, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkSettings();
