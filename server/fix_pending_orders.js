const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const Booking = require('./src/models/booking.model');
const Transaction = require('./src/models/transaction.model');

async function fixOrders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        
        const result = await Booking.updateMany(
            { payment_status: 'pending' },
            { payment_status: 'paid' }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} bookings to 'paid'`);

        // Also create missing transaction records for these if they don't exist
        const bookings = await Booking.find({ payment_status: 'paid' });
        for (const booking of bookings) {
            const exists = await Transaction.findOne({ order_id: booking._id });
            if (!exists) {
                await Transaction.create({
                    order_id: booking._id,
                    organizer_id: booking.organizer_id,
                    event_id: booking.event_id,
                    type: 'sale',
                    amount: booking.amount_total,
                    base_amount: booking.base_amount_total,
                    exchange_rate: booking.exchange_rate,
                    platform_fee: booking.platform_fee,
                    organizer_amount: booking.organizer_amount,
                    currency: booking.currency || 'EUR',
                    status: 'completed',
                    description: `Manually fixed: ${booking.event_name}`
                });
                console.log(`✨ Created transaction for ${booking.booking_reference}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixOrders();
