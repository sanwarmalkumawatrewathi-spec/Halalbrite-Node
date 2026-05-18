const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const Organizer = require('./src/models/organizer.model');

async function migrateSlugs() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const organizers = await Organizer.find();
        console.log(`Found ${organizers.length} organizer profiles in the database.`);

        let updatedCount = 0;
        for (const org of organizers) {
            if (!org.slug) {
                console.log(`Generating slug for organization: "${org.name}" (ID: ${org._id})`);
                // Calling .save() will trigger the pre-save slugification hook we just fixed!
                await org.save();
                console.log(`-> Generated slug: "${org.slug}"`);
                updatedCount++;
            } else {
                console.log(`Organization "${org.name}" already has a slug: "${org.slug}"`);
            }
        }

        console.log(`Migration complete! Successfully updated ${updatedCount} organizer profiles.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateSlugs();
