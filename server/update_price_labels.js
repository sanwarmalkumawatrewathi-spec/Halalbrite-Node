const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '../../server/.env') });

const Event = require('../../server/src/models/event.model');
const AppSetting = require('../../server/src/models/appSetting.model');

async function updatePriceLabels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const settings = await AppSetting.findOne();
        const currencySymbol = settings?.platform?.currency === 'EUR' ? '€' : settings?.platform?.currency === 'USD' ? '$' : '£';

        const events = await Event.find({});
        console.log(`Found ${events.length} events to update`);

        for (const event of events) {
            const ticketTypes = event.ticketTypes || [];
            let minPrice = Infinity;
            let hasTickets = ticketTypes.length > 0;

            if (hasTickets) {
                ticketTypes.forEach(ticket => {
                    const ticketPrice = parseFloat(ticket.price) || 0;
                    if (ticketPrice < minPrice) minPrice = ticketPrice;
                });
                
                if (minPrice === 0) {
                    event.priceLabel = 'Free';
                } else if (ticketTypes.length > 1) {
                    event.priceLabel = `From ${currencySymbol}${minPrice}`;
                } else {
                    event.priceLabel = `${currencySymbol}${minPrice}`;
                }
                event.price = minPrice;
            } else {
                event.priceLabel = event.price === 0 ? 'Free' : `${currencySymbol}${event.price || 0}`;
            }

            await event.save();
            console.log(`Updated event: ${event.title} -> ${event.priceLabel}`);
        }

        console.log('Finished updating price labels');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updatePriceLabels();
