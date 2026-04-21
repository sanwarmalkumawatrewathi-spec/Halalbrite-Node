const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const User = require('../server/src/models/user.model');

async function migrateRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all users that still have the old 'role' field
        // Note: Using lean() or raw access because the schema might ignore 'role' now
        const rawUsers = await mongoose.connection.db.collection('users').find({ role: { $exists: true } }).toArray();
        
        console.log(`🔍 Found ${rawUsers.length} users to migrate.`);

        for (const rawUser of rawUsers) {
            console.log(`🔄 Migrating user: ${rawUser.username || rawUser.email}`);
            
            await mongoose.connection.db.collection('users').updateOne(
                { _id: rawUser._id },
                { 
                    $set: { roles: [rawUser.role] }, // Convert to array
                    $unset: { role: "" }             // Remove old field
                }
            );
        }

        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrateRoles();
