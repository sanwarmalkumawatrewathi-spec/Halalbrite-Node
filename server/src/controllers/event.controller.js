const Event = require('../models/event.model');

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const { category, eventType, search, city } = req.query;
        let query = { status: 'published' };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (eventType) {
            query.eventType = eventType;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { "location.venueName": { $regex: search, $options: 'i' } },
                { "location.city": { $regex: search, $options: 'i' } }
            ];
        } else if (city) {
            query["location.city"] = { $regex: city, $options: 'i' };
        }

        const events = await Event.find(query)
            .populate('organizer', 'username avatar')
            .populate('category', 'name slug icon');
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
