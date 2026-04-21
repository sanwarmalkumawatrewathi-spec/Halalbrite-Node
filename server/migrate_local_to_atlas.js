const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/halalbrite';
const ATLAS_URI = 'mongodb://sk:System2026@ac-f2ecirm-shard-00-00.ysxqa46.mongodb.net:27017/halalbrite?ssl=true&authSource=admin&retryWrites=true&w=majority';

const migrate = async () => {
    try {
        console.log('🔌 Connecting to Local MongoDB...');
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connected to Local');

        console.log('🔌 Connecting to Atlas MongoDB...');
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connected to Atlas');

        const collections = ['users', 'roles', 'categories', 'events', 'bookings', 'transactions', 'payouts', 'organizers', 'settings', 'faqs', 'inquiries'];

        for (const colName of collections) {
            console.log(`\n📦 Migrating: ${colName}...`);
            
            const localCol = localConn.collection(colName);
            const atlasCol = atlasConn.collection(colName);

            const data = await localCol.find({}).toArray();
            console.log(`   Found ${data.length} documents locally.`);

            if (data.length > 0) {
                // Clear existing data in Atlas for this collection
                await atlasCol.deleteMany({});
                console.log(`   🗑️ Cleared existing ${colName} in Atlas.`);

                // Insert into Atlas
                await atlasCol.insertMany(data);
                console.log(`   ✅ Successfully migrated ${data.length} documents.`);
            } else {
                console.log(`   ⚠️ No data found to migrate.`);
            }
        }

        console.log('\n✨ MIGRATION COMPLETED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Error:', err);
        process.exit(1);
    }
};

migrate();
