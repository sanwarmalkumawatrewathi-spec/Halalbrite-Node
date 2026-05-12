const User = require('../models/user.model');
const Event = require('../models/event.model');
const Booking = require('../models/booking.model');
const Organizer = require('../models/organizer.model');
const Payout = require('../models/payout.model');
const Category = require('../models/category.model');
const stripeService = require('../services/stripe.service');
const mongoose = require('mongoose');

// ==========================================
// ATTENDEE DASHBOARD
// ==========================================

// @desc    Get attendee profile
// @route   GET /api/dashboard/attendee/profile
// @access  Private/Attendee
// @desc    Get user profile
// @route   GET /api/dashboard/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('roles', 'name slug')
            .select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update attendee profile
// @route   PUT /api/dashboard/attendee/profile
// @access  Private/Attendee
// @desc    Update user profile
// @route   PUT /api/dashboard/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, bio } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields
        user.firstName = firstName !== undefined ? firstName : user.firstName;
        user.lastName = lastName !== undefined ? lastName : user.lastName;
        user.phone = phone !== undefined ? phone : user.phone;
        user.bio = bio !== undefined ? bio : user.bio;

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// ADDRESS MANAGEMENT
// ==========================================

// @desc    Get user addresses
// @route   GET /api/dashboard/user/addresses
// @access  Private
exports.getUserAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add new address
// @route   POST /api/dashboard/user/addresses
// @access  Private
exports.addUserAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // If it's the first address, make it default
        if (user.addresses.length === 0) {
            req.body.isDefault = true;
        } else if (req.body.isDefault) {
            // If new address is set as default, unset others
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(req.body);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: user.addresses[user.addresses.length - 1]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/dashboard/user/addresses/:id
// @access  Private
exports.updateUserAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If setting this as default, unset others
        if (req.body.isDefault && !address.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        res.json({
            success: true,
            message: 'Address updated successfully',
            data: address
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/dashboard/user/addresses/:id
// @access  Private
exports.deleteUserAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const wasDefault = address.isDefault;
        address.remove();

        // If we deleted the default address and have others left, make the first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Set default address
// @route   PATCH /api/dashboard/user/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === req.params.id;
        });

        await user.save();

        res.json({
            success: true,
            message: 'Default address updated successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my tickets (bookings)
// @route   GET /api/dashboard/attendee/tickets
// @access  Private/Attendee
// @desc    Get my tickets (bookings)
// @route   GET /api/dashboard/user/tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.user._id })
            .populate({
                path: 'event_id',
                select: 'title startDate endDate location banner organizer slug',
                populate: { path: 'organizer', select: 'username' }
            })
            .sort({ createdAt: -1 });

        // Map statuses for frontend logic if needed (e.g. "past" vs "upcoming")
        const formattedBookings = bookings.map(booking => {
            const b = booking.toObject();
            const eventDate = b.event_id ? new Date(b.event_id.startDate) : (b.event_date ? new Date(b.event_date) : new Date());
            const now = new Date();
            b.eventStatus = eventDate < now ? 'past' : 'upcoming';
            return b;
        });

        res.json({
            success: true,
            data: formattedBookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get saved events and followed organizers
// @route   GET /api/dashboard/attendee/saved
// @access  Private/Attendee
// @desc    Get saved events and followed organizers
// @route   GET /api/dashboard/user/saved
// @access  Private
exports.getSavedItems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'savedEvents',
                select: 'title startDate endDate price priceLabel banner location slug'
            })
            .populate({
                path: 'followedOrganizers',
                select: 'username avatar bio slug'
            });

        res.json({
            success: true,
            data: {
                savedEvents: user.savedEvents || [],
                followedOrganizers: user.followedOrganizers || []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle Save Event
// @route   POST /api/dashboard/user/save-event/:id
// @access  Private
exports.toggleSaveEvent = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const eventId = req.params.id;

        const isSaved = user.savedEvents.includes(eventId);
        if (isSaved) {
            user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
        } else {
            user.savedEvents.push(eventId);
        }

        await user.save();
        res.json({
            success: true,
            message: isSaved ? 'Event removed from saved' : 'Event saved successfully',
            isSaved: !isSaved
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle Follow Organizer
// @route   POST /api/dashboard/user/follow-organizer/:id
// @access  Private
exports.toggleFollowOrganizer = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const organizerId = req.params.id;

        const isFollowing = user.followedOrganizers.includes(organizerId);
        if (isFollowing) {
            user.followedOrganizers = user.followedOrganizers.filter(id => id.toString() !== organizerId);
        } else {
            user.followedOrganizers.push(organizerId);
        }

        await user.save();
        res.json({
            success: true,
            message: isFollowing ? 'Unfollowed organizer' : 'Followed organizer successfully',
            isFollowing: !isFollowing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// SETTINGS & PREFERENCES
// ==========================================

// @desc    Update user preferences
// @route   PUT /api/dashboard/user/preferences
// @access  Private
exports.updateUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.preferences = { ...user.preferences, ...req.body };
        await user.save();

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: user.preferences
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Become an Organizer
// @route   POST /api/dashboard/user/upgrade
// @access  Private
exports.upgradeToOrganizer = async (req, res) => {
    try {
        const Role = require('../models/role.model');
        const organizerRole = await Role.findOne({ slug: 'organizer' });

        if (!organizerRole) {
            return res.status(500).json({ success: false, message: 'Organizer role not configured' });
        }

        const user = await User.findById(req.user._id).populate('roles');
        const alreadyOrganizer = user.roles.some(r => r.slug === 'organizer' || r.slug === 'administrator');

        if (alreadyOrganizer) {
            return res.status(400).json({ success: false, message: 'User is already an organizer or admin' });
        }

        user.roles.push(organizerRole._id);
        await user.save();

        res.json({
            success: true,
            message: 'Account upgraded to Organizer successfully. Please relogin to refresh permissions.',
            data: { role: 'organizer' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// ORGANIZER DASHBOARD
// ==========================================

// @desc    Get organizer dashboard stats
// @route   GET /api/dashboard/organizer/stats
// @access  Private/Organizer
exports.getOrganizerStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const stripeConnected = !!user.stripeConnectedId;

        // Find all events by this organizer
        const events = await Event.find({ organizer: req.user._id });
        const eventIds = events.map(e => e._id);

        // Active events count
        const activeEventsCount = events.filter(e => e.status === 'published' && new Date(e.endDate) > new Date()).length;

        // Calculate total sales and revenue from paid/free bookings
        const bookings = await Booking.find({
            event_id: { $in: eventIds },
            payment_status: { $in: ['paid', 'free'] }
        });

        const totalRevenue = bookings.reduce((acc, b) => acc + (b.organizer_amount || 0), 0);
        const totalTicketsSold = bookings.reduce((acc, b) => acc + (b.quantity || 0), 0);

        // Chart Data: Revenue last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const revenueByMonth = await Booking.aggregate([
            {
                $match: {
                    event_id: { $in: eventIds },
                    payment_status: { $in: ['paid', 'free'] },
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$organizer_amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Event Distribution by Category
        const eventDistribution = await Event.aggregate([
            { $match: { organizer: req.user._id } },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log("[DEBUG] Event Distribution Data:", JSON.stringify(eventDistribution, null, 2));

        let stripeBalance = { available: 0, pending: 0 };

        // Auto-sync Stripe status if connected but not fully enabled
        if (user.stripeConnectedId && (!user.charges_enabled || !user.payouts_enabled)) {
            console.log(`🔄 Dashboard: Auto-syncing Stripe for ${user.email}...`);
            await stripeService.syncUserStripeStatus(user._id);
            // Refresh user object after sync
            const updatedUser = await User.findById(user._id);
            user.charges_enabled = updatedUser.charges_enabled;
            user.payouts_enabled = updatedUser.payouts_enabled;
            user.verification_status = updatedUser.verification_status;
            user.requirements = updatedUser.requirements;
        }

        if (stripeConnected) {
            try {
                const balance = await stripeService.getAccountBalance(user.stripeConnectedId);
                // Sum up available and pending balances across all currencies
                stripeBalance.available = balance.available.reduce((acc, b) => acc + (b.amount / 100), 0);
                stripeBalance.pending = balance.pending.reduce((acc, b) => acc + (b.amount / 100), 0);
            } catch (err) {
                console.error('Error fetching Stripe balance:', err.message);
            }
        }

        res.json({
            success: true,
            data: {
                stripeConnected,
                chargesEnabled: user.charges_enabled,
                payoutsEnabled: user.payouts_enabled,
                verificationStatus: user.verification_status,
                requirements: user.requirements || [],
                stats: {
                    availableBalance: stripeBalance.available,
                    pendingBalance: stripeBalance.pending,
                    ticketsSold: totalTicketsSold,
                    activeEvents: activeEventsCount,
                    totalRevenue
                },
                chartData: revenueByMonth,
                eventDistribution
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get organizer's own events
// @route   GET /api/dashboard/organizer/events
// @access  Private/Organizer
// @desc    Get organizer's own events
// @route   GET /api/dashboard/organizer/events
// @access  Private/Organizer
exports.getOrganizerEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id })
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        // Add sold/total info for each event
        const eventsWithStats = await Promise.all(events.map(async (event) => {
            const bookings = await Booking.find({ event_id: event._id, payment_status: { $in: ['paid', 'free'] } });
            const sold = bookings.reduce((acc, b) => acc + b.quantity, 0);
            const revenue = bookings.reduce((acc, b) => acc + b.organizer_amount, 0);

            return {
                ...event.toObject(),
                ticketsSold: sold,
                totalRevenue: revenue
            };
        }));

        res.json({
            success: true,
            data: eventsWithStats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// ORGANIZER CUSTOMERS & PAYOUTS
// ==========================================

// @desc    Get organizer's customers (attendees)
// @route   GET /api/dashboard/organizer/customers
// @access  Private/Organizer
exports.getOrganizerCustomers = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        const eventIds = events.map(e => e._id);

        const bookings = await Booking.find({ event_id: { $in: eventIds } })
            .populate('event_id', 'title startDate location')
            .populate('user_id', 'username email avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get organizer's payout history
// @route   GET /api/dashboard/organizer/payouts
// @access  Private/Organizer
exports.getOrganizerPayouts = async (req, res) => {
    try {
        const payouts = await Payout.find({ organizer_id: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: payouts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// ORGANIZER PROFILE MANAGEMENT (Organisations)
// ==========================================

// @desc    Get organizer's organisations
// @route   GET /api/dashboard/organizer/organisations
// @access  Private/Organizer
exports.getOrganisations = async (req, res) => {
    try {
        const organisations = await Organizer.find({ user: req.user._id });
        res.json({
            success: true,
            data: organisations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create organisation
// @route   POST /api/dashboard/organizer/organisations
// @access  Private/Organizer
exports.createOrganisation = async (req, res) => {
    try {
        const organisation = new Organizer({
            ...req.body,
            user: req.user._id
        });
        await organisation.save();
        res.status(201).json({
            success: true,
            data: organisation
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update organisation
// @route   PUT /api/dashboard/organizer/organisations/:id
// @access  Private/Organizer
exports.updateOrganisation = async (req, res) => {
    try {
        const organisation = await Organizer.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!organisation) {
            return res.status(404).json({ success: false, message: 'Organisation not found' });
        }

        res.json({
            success: true,
            data: organisation
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete organisation
// @route   DELETE /api/dashboard/organizer/organisations/:id
// @access  Private/Organizer
exports.deleteOrganisation = async (req, res) => {
    try {
        const organisation = await Organizer.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!organisation) {
            return res.status(404).json({ success: false, message: 'Organisation not found' });
        }

        res.json({
            success: true,
            message: 'Organisation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Message an attendee
// @route   POST /api/dashboard/organizer/message-attendee
// @access  Private/Organizer
exports.messageAttendee = async (req, res) => {
    try {
        const { bookingId, subject, message } = req.body;

        if (!bookingId || !message) {
            return res.status(400).json({ success: false, message: 'Please provide booking ID and message' });
        }

        const booking = await Booking.findById(bookingId).populate('user_id');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Verify organizer ownership
        if (booking.organizer_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to message this attendee' });
        }

        const email = booking.customer_email || booking.user_id?.email;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Attendee email not found' });
        }

        // Send email using emailService
        const emailService = require('../services/email.service');
        await emailService.sendNotificationEmail(
            email,
            subject || `Message from ${req.user.username} regarding your booking`,
            subject || "Message from Organizer",
            message,
            booking
        );

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Suggest/Add a new category
// @route   POST /api/dashboard/organizer/suggest-category
// @access  Private/Organizer
exports.suggestCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        // Check if exists
        const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const category = await Category.create({ name });

        res.json({
            success: true,
            message: 'Category added successfully',
            data: category
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
