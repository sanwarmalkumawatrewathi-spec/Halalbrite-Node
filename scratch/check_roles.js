const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const Role = require('../server/src/models/role.model');

async function checkRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const roles = await Role.find({});
        console.log('Roles in DB:', JSON.stringify(roles, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRoles();
