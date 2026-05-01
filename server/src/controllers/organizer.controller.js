const mongoose = require('mongoose');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Role = require('../models/role.model');

// @desc    Get Organizer Profile
// @route   GET /api/organizers/:id
exports.getOrganizerProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const searchId = id.toLowerCase();
        let organizer = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            organizer = await User.findById(id)
                .select('-password')
                .populate('followers', 'username avatar');
        }

        if (!organizer) {
            organizer = await User.findOne({ slug: searchId })
                .select('-password')
                .populate('followers', 'username avatar');
        }

        if (!organizer) {
            return res.status(404).json({ success: false, message: 'Organizer not found' });
        }

        // Check if user has organizer role
        const organizerRole = await Role.findOne({ slug: 'organizer' });
        const isAdmin = await Role.findOne({ slug: 'administrator' });
        
        const isOrg = organizer.roles?.some(roleId => 
            roleId.toString() === organizerRole?._id?.toString() || 
            roleId.toString() === isAdmin?._id?.toString()
        );

        const stats = {
            followersCount: organizer.followers?.length || 0,
            totalEvents: await Event.countDocuments({ organizer: organizer._id, status: 'published' })
        };

        res.json({
            success: true,
            data: {
                ...organizer.toObject(),
                stats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Organizer Events
// @route   GET /api/organizers/:id/events
exports.getOrganizerEvents = async (req, res) => {
    try {
        const { id } = req.params;
        let organizer;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            organizer = await User.findById(id);
        }

        if (!organizer) {
            organizer = await User.findOne({ slug: id });
        }

        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        const { type } = req.query; // 'upcoming' or 'past'
        const now = new Date();
        
        let query = { 
            organizer: organizer._id,
            status: 'published'
        };

        if (type === 'upcoming') {
            query.startDate = { $gte: now };
        } else if (type === 'past') {
            query.startDate = { $lt: now };
        }

        const events = await Event.find(query)
            .populate('category')
            .sort({ startDate: type === 'upcoming' ? 1 : -1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow/Unfollow Organizer
// @route   POST /api/organizers/:id/follow
exports.toggleFollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        let organizer;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            organizer = await User.findById(id);
        }
        if (!organizer) {
            organizer = await User.findOne({ slug: id });
        }

        if (!organizer) return res.status(404).json({ message: 'Organizer not found' });

        if (organizer._id.toString() === userId.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const user = await User.findById(userId);

        const isFollowing = organizer.followers.some(id => id.toString() === userId.toString());

        if (isFollowing) {
            // Unfollow
            organizer.followers = organizer.followers.filter(id => id.toString() !== userId.toString());
            user.followedOrganizers = user.followedOrganizers.filter(id => id.toString() !== organizer._id.toString());
        } else {
            // Follow
            organizer.followers.push(userId);
            user.followedOrganizers.push(organizer._id);
        }

        await Promise.all([organizer.save(), user.save()]);

        res.json({ 
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing,
            followersCount: organizer.followers.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
