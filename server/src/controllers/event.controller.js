const Event = require('../models/event.model');
const User = require('../models/user.model');


// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const { 
            category, 
            eventType, 
            search, 
            city, 
            upcoming,
            startDate,
            endDate,
            minPrice,
            maxPrice
        } = req.query;

        let query = { status: 'published' };

        // 1. Date Filtering
        if (upcoming === 'true') {
            query.startDate = { $gte: new Date() };
        } else if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        // 2. Category Filtering (Support single or multiple)
        if (category && category !== 'All') {
            if (Array.isArray(category)) {
                query.category = { $in: category };
            } else if (category.includes(',')) {
                query.category = { $in: category.split(',') };
            } else {
                query.category = category;
            }
        }

        // 3. Event Type
        if (eventType) {
            query.eventType = eventType;
        }

        // 4. Price Range
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
            if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
        }

        // 5. Search & City
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { organizerName: searchRegex },
                { "location.venueName": searchRegex },
                { "location.city": searchRegex }
            ];
        } else if (city) {
            if (Array.isArray(city)) {
                query["location.city"] = { $in: city.map(c => new RegExp(c, 'i')) };
            } else if (city.includes(',')) {
                query["location.city"] = { $in: city.split(',').map(c => new RegExp(c.trim(), 'i')) };
            } else {
                query["location.city"] = { $regex: city, $options: 'i' };
            }
        }

        const events = await Event.find(query)
            .populate('organizer', 'username avatar')
            .populate('category', 'name slug icon')
            .sort({ startDate: 1 }); // Show soonest events first

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'username avatar email')
            .populate('category', 'name slug description icon');
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
exports.createEvent = async (req, res) => {
    try {
        // Validation: Organizer must have a connected Stripe account to post events
        const isAdministrator = req.user.roles.some(r => r.slug === 'administrator');
        if (!isAdministrator && !req.user.stripeConnectedId) {
            return res.status(403).json({ message: 'Stripe account connection required to post events. Please connect your Stripe account in the dashboard.' });
        }

        const settings = await require('../models/appSetting.model').findOne();
        const currencySymbol = settings?.platform?.currency === 'EUR' ? '€' : settings?.platform?.currency === 'USD' ? '$' : '£';
        const { ticketTypes } = req.body;
        let minPrice = Infinity;
        let hasTickets = ticketTypes && ticketTypes.length > 0;
        
        if (hasTickets) {
            ticketTypes.forEach(ticket => {
                const ticketPrice = parseFloat(ticket.price) || 0;
                if (ticketPrice < minPrice) minPrice = ticketPrice;
            });
        }

        const eventData = {
            ...req.body,
            organizer: req.user._id,
            organizerName: req.body.organizerName || req.user.username,
            price: hasTickets ? (minPrice === Infinity ? 0 : minPrice) : (req.body.price || 0),
            priceLabel: hasTickets ? (minPrice === 0 ? 'Free' : `From ${currencySymbol}${minPrice}`) : (req.body.price === 0 ? 'Free' : `${currencySymbol}${req.body.price || 0}`)
        };

        const event = await Event.create(eventData);
        res.status(201).json({
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            // Check ownership
            const isAdministrator = req.user.roles.some(r => r.slug === 'administrator');
            if (event.organizer.toString() !== req.user._id.toString() && !isAdministrator) {
                return res.status(403).json({ message: 'Not authorized to update this event' });
            }

            // Recalculate price if ticketTypes updated
            if (req.body.ticketTypes) {
                const settings = await require('../models/appSetting.model').findOne();
                const currencySymbol = settings?.platform?.currency === 'EUR' ? '€' : settings?.platform?.currency === 'USD' ? '$' : '£';

                const { ticketTypes } = req.body;
                let minPrice = Infinity;
                if (ticketTypes.length > 0) {
                    ticketTypes.forEach(ticket => {
                        const ticketPrice = parseFloat(ticket.price) || 0;
                        if (ticketPrice < minPrice) minPrice = ticketPrice;
                    });
                    req.body.price = minPrice;
                    req.body.priceLabel = minPrice === 0 ? 'Free' : `From ${currencySymbol}${minPrice}`;
                } else {
                    req.body.priceLabel = 'Free';
                }
            }

            Object.assign(event, req.body);
            const updatedEvent = await event.save();
            res.json({
                message: 'Event updated successfully',
                data: updatedEvent
            });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            const isAdministrator = req.user.roles.some(r => r.slug === 'administrator');
            if (event.organizer.toString() !== req.user._id.toString() && !isAdministrator) {
                return res.status(403).json({ message: 'Not authorized to delete this event' });
            }
            await event.deleteOne();
            res.json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle save event for user
// @route   POST /api/events/:id/save
// @access  Private
exports.toggleSaveEvent = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const eventId = req.params.id;

        if (user.savedEvents.includes(eventId)) {
            user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
            await user.save();
            res.json({ message: 'Event unsaved', saved: false });
        } else {
            user.savedEvents.push(eventId);
            await user.save();
            res.json({ message: 'Event saved', saved: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's saved events
// @route   GET /api/events/saved-events
// @access  Private
exports.getSavedEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'savedEvents',
            populate: [
                { path: 'organizer', select: 'username avatar' },
                { path: 'category', select: 'name slug icon' }
            ]
        });
        res.json(user.savedEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get event locations grouped by country and city
// @route   GET /api/events/locations
// @access  Public
exports.getEventLocations = async (req, res) => {
    console.log('🔍 GET /api/events/locations - Fetching unique event locations...');
    try {
        const locations = await Event.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: {
                        country: { $ifNull: ["$location.country", "Other"] },
                        city: { $ifNull: ["$location.city", "Global"] }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.country",
                    cities: {
                        $push: {
                            name: "$_id.city",
                            count: "$count"
                        }
                    },
                    totalCount: { $sum: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    cities: 1,
                    cityCount: { $size: "$cities" }
                }
            },
            { $sort: { country: 1 } }
        ]);

        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

