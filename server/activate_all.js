const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const AppSetting = require('./src/models/appSetting.model');

async function activateAll() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        let settings = await AppSetting.findOne();
        if (settings) {
            settings.socialLogin.google.isActive = true;
            settings.socialLogin.meta.isActive = true;
            settings.socialLogin.apple.isActive = true;
            await settings.save();
            console.log('✅ All social logins set to active in DB');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
activateAll();
