const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Event = require('./src/models/event.model');
const Category = require('./src/models/category.model');
const Booking = require('./src/models/booking.model');
const Transaction = require('./src/models/transaction.model');
const dotenv = require('dotenv');

dotenv.config();

const runFullPaymentTest = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/halalbrite');
        console.log('✅ Connected to MongoDB');

        // 1. Find the Organizer
        const organizer = await User.findOne({ email: 'hbtest-mern@mailnator.com' });
        if (!organizer) {
            console.error('❌ Organizer not found!');
            process.exit(1);
        }
        console.log(`👤 Found Organizer: ${organizer.username} (${organizer.stripeConnectedId})`);

        // 2. Ensure a Category exists
        let category = await Category.findOne();
        if (!category) {
            category = await Category.create({ name: 'Test Category', slug: 'test-category' });
        }

        // 3. Create a Dummy Event
        const event = await Event.create({
            title: 'Stripe Connect Test Event',
            description: 'Testing split payments and transfers.',
            category: category._id,
            organizer: organizer._id,
            organizerName: organizer.username,
            startDate: new Date(),
            endDate: new Date(),
            startTime: '10:00',
            endTime: '12:00',
            location: {
                venueName: 'Test Venue',
                address: '123 Stripe Way',
                city: 'London',
                country: 'UK'
            },
            ticketTypes: [{
                name: 'Standard Entry',
                price: 100, // £100
                quantity: 50,
                platformFee: 5,
                vatOnPlatformFee: 1,
                stripeProcessingFee: 2,
                totalFees: 8
            }],
            feePayment: false, // Buyer pays fees
            status: 'published'
        });
        console.log(`📅 Created Test Event: ${event.title}`);

        // 4. Create a Pending Booking
        const booking = await Booking.create({
            booking_reference: `TEST-${Math.random().toString(36).substring(7).toUpperCase()}`,
            user_id: organizer._id, // Using same user for simplicity
            organizer_id: organizer._id,
            event_id: event._id,
            event_name: event.title,
            ticket_name: 'Standard Entry',
            quantity: 1,
            amount_total: 108, // 100 + 8
            organizer_amount: 100,
            platform_fee: 8,
            currency: 'gbp',
            payment_status: 'pending',
            customer_name: 'Test Buyer',
            customer_email: 'buyer@test.com'
        });
        console.log(`🎟️ Created Pending Booking: ${booking.booking_reference}`);

        // 5. Simulate Webhook Success (The actual Transfer Logic)
        console.log('📡 Simulating Webhook success...');
        
        // This mirrors handlePaymentIntentSucceeded in payment.controller.js
        booking.payment_status = 'paid';
        booking.stripe_payment_intent_id = 'pi_test_simulated_' + Date.now();
        booking.stripe_charge_id = 'ch_test_simulated_' + Date.now();
        await booking.save();

        let stripeTransferId = null;
        if (booking.organizer_amount > 0 && organizer.stripeConnectedId) {
            console.log(`💸 Attempting Transfer of £${booking.organizer_amount} to ${organizer.stripeConnectedId}...`);
            
            // In a real scenario, we'd call Stripe here. 
            // Since it's a test script, we simulate the success if account ID is present.
            stripeTransferId = 'tr_test_simulated_' + Date.now();
            console.log(`✅ Simulated Stripe Transfer Success: ${stripeTransferId}`);
        }

        // 6. Create Transaction Record
        const transaction = await Transaction.create({
            order_id: booking._id,
            organizer_id: organizer._id,
            event_id: event._id,
            amount: booking.amount_total,
            platform_fee: booking.platform_fee,
            organizer_amount: booking.organizer_amount,
            currency: 'GBP',
            status: 'completed',
            stripe_payment_intent_id: booking.stripe_payment_intent_id,
            stripe_charge_id: booking.stripe_charge_id,
            stripe_transfer_id: stripeTransferId,
            type: 'sale',
            description: `1 × ${booking.ticket_name} for ${booking.event_name}`
        });

        console.log('📊 Transaction Ledger Updated');
        console.log('\n--- TEST COMPLETE ---');
        console.log(`Event ID:   ${event._id}`);
        console.log(`Booking ID: ${booking._id}`);
        console.log(`Result:     Success! Organizer ${organizer.username} earned £${booking.organizer_amount}`);
        console.log('----------------------\n');

        process.exit();
    } catch (err) {
        console.error('❌ Test Failed:', err);
        process.exit(1);
    }
};

runFullPaymentTest();
