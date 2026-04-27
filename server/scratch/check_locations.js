const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const Event = mongoose.model('Event', new mongoose.Schema({ 
            status: String, 
            location: { country: String, city: String } 
        }, { collection: 'events' }));

        const events = await Event.find({ status: 'published' });
        console.log(`Found ${events.length} published events.`);
        
        const withLocation = events.filter(e => e.location && (e.location.city || e.location.country));
        console.log(`Events with location data: ${withLocation.length}`);
        
        if (withLocation.length > 0) {
            console.log('Sample locations:');
            withLocation.slice(0, 5).forEach(e => console.log(` - ${e.location.city}, ${e.location.country}`));
        } else {
            console.log('WARNING: No events have location data. Updating first few events with dummy locations for testing...');
            const dummyLocations = [
                { city: 'London', country: 'UK' },
                { city: 'Manchester', country: 'UK' },
                { city: 'Dublin', country: 'Ireland' },
                { city: 'Paris', country: 'France' },
                { city: 'Berlin', country: 'Germany' }
            ];
            
            for (let i = 0; i < Math.min(events.length, 5); i++) {
                await Event.updateOne({ _id: events[i]._id }, { location: dummyLocations[i] });
                console.log(`Updated ${events[i]._id} with ${dummyLocations[i].city}, ${dummyLocations[i].country}`);
            }
        }
        
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
