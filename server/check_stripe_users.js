const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbrite')
    .then(async () => {
        const users = await User.find({ 
            $or: [
                { stripe_account_id: { $exists: true, $ne: null } }, 
                { stripeConnectedId: { $exists: true, $ne: null } }
            ] 
        }).select('username email stripe_account_id stripeConnectedId');
        
        console.log('--- USERS WITH STRIPE ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('-------------------------');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
