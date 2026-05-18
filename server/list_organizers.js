const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../Halalbrite-Node/server/.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbrite';

async function run() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully!");
        
        // Define schemas
        const UserSchema = new mongoose.Schema({
            username: String,
            email: String,
            followedOrganizers: [mongoose.Schema.Types.ObjectId]
        });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const OrganizerSchema = new mongoose.Schema({
            name: String,
            slug: String,
            followers: [mongoose.Schema.Types.ObjectId],
            user: mongoose.Schema.Types.ObjectId
        });
        const Organizer = mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);

        const organizers = await Organizer.find({});
        console.log("\n=== Dedicated Organizers ===");
        for (const org of organizers) {
            console.log(`Name: ${org.name}, Slug: ${org.slug}, ID: ${org._id}, Followers Count: ${org.followers?.length || 0}, Followers: ${JSON.stringify(org.followers)}`);
        }

        const users = await User.find({});
        console.log("\n=== Users with Followed Organizers ===");
        for (const u of users) {
            if (u.followedOrganizers?.length > 0) {
                console.log(`User: ${u.username}, Followed: ${JSON.stringify(u.followedOrganizers)}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
