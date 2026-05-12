const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Event = require('./src/models/event.model');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const event = await Event.findOne({ title: 'testing' }).lean();
        if (event) {
            console.log('Event keys:', Object.keys(event));
            console.log('Ticket types:', JSON.stringify(event.ticketTypes, null, 2));
            console.log('Capacity:', event.capacity);
        } else {
            console.log('Event not found');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

debug();
