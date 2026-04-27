const mongoose = require('mongoose');
const Event = require('./src/models/event.model');
require('dotenv').config();

async function spreadEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // London: [-0.15, 51.5]
        // Birmingham: [-1.89, 52.48]
        // Manchester: [-2.24, 53.48]
        // Leeds: [-1.54, 53.80]

        const events = await Event.find({ status: 'published' });
        
        const coords = [
            [-0.12, 51.50], // London
            [-1.89, 52.48], // Birmingham
            [-2.24, 53.48], // Manchester
            [-1.54, 53.80], // Leeds
            [-2.99, 53.40], // Liverpool
            [-3.18, 55.95]  // Edinburgh
        ];

        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const newCoord = coords[i % coords.length];
            
            event.location.geometry = {
                type: 'Point',
                coordinates: newCoord
            };
            
            // Also update city name to match for consistency in tooltip
            if (i === 1) event.location.city = 'Birmingham';
            if (i === 2) event.location.city = 'Manchester';
            if (i === 3) event.location.city = 'Leeds';
            if (i === 4) event.location.city = 'Liverpool';
            if (i === 5) event.location.city = 'Edinburgh';

            await event.save();
            console.log(`Updated ${event.title} to ${newCoord}`);
        }

        await mongoose.disconnect();
        console.log('Done spreading events');
    } catch (error) {
        console.error(error);
    }
}

spreadEvents();
