const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Role = require('./src/models/role.model');
const dotenv = require('dotenv');

dotenv.config();

const createTestOrganizer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbrite');
        
        const organizerRole = await Role.findOne({ slug: 'organizer' });
        if (!organizerRole) {
            console.error('Organizer role not found. Please run seed first.');
            process.exit(1);
        }

        const email = `test_org_${Date.now()}@example.com`;
        const user = await User.create({
            username: `test_organizer_${Math.floor(Math.random() * 1000)}`,
            email: email,
            password: 'password123',
            role: organizerRole._id,
            firstName: 'Test',
            lastName: 'Organizer',
            status: 'active'
        });

        console.log('\n🚀 NEW TEST ORGANIZER CREATED');
        console.log('-------------------------------');
        console.log(`Email:    ${email}`);
        console.log(`Password: password123`);
        console.log('-------------------------------\n');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestOrganizer();
