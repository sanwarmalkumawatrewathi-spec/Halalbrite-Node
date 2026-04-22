const mongoose = require('mongoose');
const Event = require('./src/models/event.model');
const Category = require('./src/models/category.model'); // If needed
require('dotenv').config();

async function checkEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const allEvents = await Event.find({});
        console.log(`Total events in DB: ${allEvents.length}`);

        const publishedEvents = await Event.find({ status: 'published' });
        console.log(`Published events: ${publishedEvents.length}`);

        const now = new Date();
        const upcomingEvents = await Event.find({ 
            status: 'published',
            startDate: { $gte: now }
        });
        console.log(`Upcoming published events: ${upcomingEvents.length}`);

        upcomingEvents.forEach(e => {
            console.log(`- ${e.title} | Date: ${e.startDate} | Coords: ${JSON.stringify(e.location?.geometry?.coordinates)}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkEvents();
