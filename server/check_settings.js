const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const AppSetting = require('./src/models/appSetting.model');

async function checkSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        
        let settings = await AppSetting.findOne();
        if (!settings) {
            console.log('❌ No settings found in DB. Creating default...');
            settings = await AppSetting.create({
                socialLogin: {
                    google: { clientId: 'your-google-id', isActive: true },
                    meta: { clientId: 'your-meta-id', isActive: true },
                    apple: { clientId: 'your-apple-id', isActive: true }
                }
            });
            console.log('✅ Default settings created');
        } else {
            console.log('Found settings:', JSON.stringify(settings.socialLogin, null, 2));
            // Ensure they are active for demo purposes if they are not
            if (!settings.socialLogin.google.isActive) {
                settings.socialLogin.google.isActive = true;
                settings.socialLogin.google.clientId = settings.socialLogin.google.clientId || 'your-google-id';
                settings.socialLogin.meta.isActive = true;
                settings.socialLogin.meta.clientId = settings.socialLogin.meta.clientId || 'your-meta-id';
                settings.socialLogin.apple.isActive = true;
                settings.socialLogin.apple.clientId = settings.socialLogin.apple.clientId || 'your-apple-id';
                await settings.save();
                console.log('✅ Settings updated to be active');
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSettings();
