const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./src/models/booking.model');

async function checkBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const bookings = await Booking.find({ payment_status: 'pending' }).limit(10);
        console.log(`Found ${bookings.length} pending bookings:`);
        
        bookings.forEach(b => {
            console.log(`- Ref: ${b.booking_reference}, SessionID: ${b.stripe_session_id ? 'EXISTS' : 'MISSING'}, Created: ${b.createdAt}`);
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkBookings();
