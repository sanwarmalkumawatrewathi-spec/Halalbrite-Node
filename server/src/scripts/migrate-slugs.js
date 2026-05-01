const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/user.model');
const Event = require('../models/event.model');

const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbrite');
        console.log('Connected!');

        // 1. Migrate Users (Organisers)
        console.log('Migrating Users...');
        const users = await User.find({ slug: { $exists: false } });
        console.log(`Found ${users.length} users without slugs.`);

        for (const user of users) {
            let baseSlug = generateSlug(user.username);
            let slug = baseSlug;
            let counter = 1;
            
            // Ensure uniqueness
            while (await User.findOne({ slug, _id: { $ne: user._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            user.slug = slug;
            await user.save();
            console.log(`Updated user: ${user.username} -> ${slug}`);
        }

        // 2. Migrate Events
        console.log('Migrating Events...');
        const events = await Event.find({ slug: { $exists: false } });
        console.log(`Found ${events.length} events without slugs.`);

        for (const event of events) {
            let baseSlug = generateSlug(event.title);
            let slug = baseSlug;
            let counter = 1;
            
            // Ensure uniqueness
            while (await Event.findOne({ slug, _id: { $ne: event._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            event.slug = slug;
            await event.save();
            console.log(`Updated event: ${event.title} -> ${slug}`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
