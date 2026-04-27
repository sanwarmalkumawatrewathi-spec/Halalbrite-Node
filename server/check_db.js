const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const AppSetting = require('./src/models/appSetting.model');

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const settings = await AppSetting.findOne();
        console.log('Current Currencies in DB:', JSON.stringify(settings.currencies, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDb();
