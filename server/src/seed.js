const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Role = require('./models/role.model');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Booking = require('./models/booking.model');
const Organizer = require('./models/organizer.model');
const Payout = require('./models/payout.model');

// Load environment variables from server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const roles = [
    {
        name: 'Administrator',
        slug: 'administrator',
        permissions: ['all', 'manage_options', 'edit_users', 'list_users', 'delete_users', 'edit_events', 'publish_events']
    },
    {
        name: 'Organizer',
        slug: 'organizer',
        permissions: ['organizer', 'list_users', 'edit_events', 'publish_events', 'manage_attendees']
    },
    {
        name: 'Attendee',
        slug: 'attendee',
        permissions: ['view_events', 'join_events', 'read']
    }
];

const categories = [
    { name: 'Conference', slug: 'conference' },
    { name: 'Workshop', slug: 'workshop' },
    { name: 'Community', slug: 'community' },
    { name: 'Food Festival', slug: 'food-festival' },
    { name: 'Educational', slug: 'educational' },
    { name: 'Charity', slug: 'charity' },
    { name: 'Outdoors', slug: 'outdoors' },
    { name: 'Children', slug: 'children' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Youth', slug: 'youth' },
    { name: 'University', slug: 'university' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for bulk seeding');

        // 0. Drop collections to reset indexes
        await User.collection.drop().catch(() => {});
        await Role.collection.drop().catch(() => {});
        await Category.collection.drop().catch(() => {});
        await Event.collection.drop().catch(() => {});
        await Booking.collection.drop().catch(() => {});
        await Payout.collection.drop().catch(() => {});
        await Organizer.collection.drop().catch(() => {});
        console.log('🗑️  All collections dropped and indexes reset');

        // 1. Insert roles
        const createdRoles = await Role.insertMany(roles);
        const adminRole = createdRoles.find(r => r.slug === 'administrator');
        const organizerRole = createdRoles.find(r => r.slug === 'organizer');
        const attendeeRole = createdRoles.find(r => r.slug === 'attendee');
        console.log(`✅ ${createdRoles.length} roles created`);

        // 2. Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} categories created`);

        // 3. Create Users
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@halalbrite.com',
            password: 'adminpassword123',
            role: adminRole._id,
            firstName: 'System',
            lastName: 'Administrator',
            status: 'active'
        });

        const organizers = [];
        for (let i = 1; i <= 3; i++) {
            const org = await User.create({
                username: `organizer${i}`,
                email: `organizer${i}@example.com`,
                password: 'password123',
                role: organizerRole._id,
                firstName: `OrgName${i}`,
                lastName: `LastName${i}`,
                status: 'active',
                stripeConnectedId: `acct_test_${i}`
            });
            organizers.push(org);
        }

        const attendees = [];
        for (let i = 1; i <= 10; i++) {
            const att = await User.create({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: 'password123',
                role: attendeeRole._id,
                firstName: `Attendee${i}`,
                lastName: `User${i}`,
                status: 'active',
                addresses: [{
                    label: 'Home',
                    street: `${i}23 Main St`,
                    city: 'London',
                    postcode: 'SW1A 1AA',
                    country: 'United Kingdom',
                    isDefault: true
                }]
            });
            attendees.push(att);
        }
        console.log('✅ Users created (1 Admin, 3 Organizers, 10 Attendees)');

        // 4. Create Organization Profiles
        const orgProfiles = [];
        for (let i = 0; i < organizers.length; i++) {
            const profile = await Organizer.create({
                user: organizers[i]._id,
                name: `${organizers[i].firstName}'s Organization`,
                website: 'https://example.org',
                bio: 'This is a leading organization in the community.',
                categories: ['Community', 'Educational'],
                socialLinks: { facebook: 'fb', instagram: 'ig' }
            });
            orgProfiles.push(profile);
        }
        console.log(`✅ ${orgProfiles.length} Organization profiles created`);

        // 5. Create Events
        const events = [];
        const eventTitles = [
            'Annual Islamic Conference 2025',
            'Halal Food Festival',
            'Community Gathering',
            'Workshop on Islamic Finance',
            'Charity Gala Dinner'
        ];

        for (let i = 0; i < eventTitles.length; i++) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + (i + 1) * 10);
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 4);

            const event = await Event.create({
                title: eventTitles[i],
                description: `A detailed description for ${eventTitles[i]}...`,
                organizer: organizers[i % organizers.length]._id,
                organizerName: orgProfiles[i % orgProfiles.length].name,
                category: createdCategories[i % createdCategories.length]._id,
                eventType: 'In Person',
                banner: `https://picsum.photos/seed/${i}/1920/1080`,
                thumbnail: `https://picsum.photos/seed/${i}/400/400`,
                startDate,
                endDate,
                startTime: '10:00',
                endTime: '14:00',
                location: {
                    venueName: 'The Grand Hall',
                    address: '123 Park Lane',
                    city: 'London',
                    postcode: 'W1K 7AA',
                    country: 'United Kingdom',
                    geometry: { type: 'Point', coordinates: [-0.15, 51.5] }
                },
                capacity: 500,
                status: i === 4 ? 'draft' : 'published',
                ticketTypes: [
                    { name: 'Standard', price: 20 + i * 5, quantity: 100, saleStart: new Date(), saleEnd: endDate },
                    { name: 'VIP', price: 50 + i * 10, quantity: 50, saleStart: new Date(), saleEnd: endDate }
                ]
            });
            events.push(event);
        }
        console.log(`✅ ${events.length} Events created`);

        // 6. Create Bookings (to fill dashboard)
        for (let i = 0; i < 20; i++) {
            const event = events[i % 4]; // Only use first 4 (published)
            const user = attendees[i % attendees.length];
            const qty = Math.floor(Math.random() * 3) + 1;
            const price = event.ticketTypes[0].price;
            const subtotal = qty * price;
            const platformFee = (subtotal * 0.05) + 1;
            const vat = platformFee * 0.2;
            const stripeFee = (subtotal * 0.02) + 0.25;
            const total = subtotal + platformFee + vat + stripeFee;

            const booking = await Booking.create({
                booking_reference: `HB-SEED-${1000 + i}`,
                user_id: user._id,
                organizer_id: event.organizer,
                event_id: event._id,
                event_name: event.title,
                event_date: event.startDate,
                event_time: event.startTime,
                event_venue: event.location.venueName,
                event_location: event.location.address,
                ticket_name: event.ticketTypes[0].name,
                quantity: qty,
                customer_name: user.username,
                customer_email: user.email,
                customer_phone: '0123456789',
                attendee_names: Array(qty).fill(0).map((_, idx) => `Guest ${idx + 1}`),
                amount_total: total,
                organizer_amount: subtotal,
                currency: 'eur',
                payment_status: 'paid'
            });
        }
        console.log('✅ 20 Bookings created');

        // 7. Create Payouts
        for (let i = 0; i < organizers.length; i++) {
            await Payout.create({
                organizer_id: organizers[i]._id,
                amount: 500 + (i * 100),
                net_amount: 490 + (i * 100),
                fee: 10,
                currency: 'eur',
                status: 'paid',
                destination: 'Barclays ****1234',
                arrival_date: new Date(),
                paid_date: new Date(),
                payout_id: `po_seed_${i}`
            });
        }
        console.log('✅ Payouts created');

        console.log('🚀 BULK SEEDING COMPLETED SUCCESSFULLY!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
