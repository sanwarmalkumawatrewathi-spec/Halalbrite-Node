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
        let isDedicatedOrg = false;

        // 1. Try finding in Organizer Model first (for dashboard-created organisations)
        if (mongoose.Types.ObjectId.isValid(id)) {
            organizer = await mongoose.model('Organizer').findById(id).populate('user', 'username email avatar followers');
            if (organizer) isDedicatedOrg = true;
        }

        if (!organizer) {
            organizer = await mongoose.model('Organizer').findOne({ slug: searchId }).populate('user', 'username email avatar followers');
            if (organizer) isDedicatedOrg = true;
        }

        // 2. Fallback to User Model (legacy or user-direct profiles)
        if (!organizer) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                organizer = await User.findById(id).select('-password').populate('followers', 'username avatar');
            }
            if (!organizer) {
                organizer = await User.findOne({ slug: searchId }).select('-password').populate('followers', 'username avatar');
            }
        }

        if (!organizer) {
            return res.status(404).json({ success: false, message: 'Organizer not found' });
        }

        // 3. Map Data consistently for frontend
        let profileData;
        if (isDedicatedOrg) {
            profileData = {
                _id: organizer._id,
                username: organizer.name,
                avatar: organizer.logo,
                bio: organizer.bio,
                categories: organizer.categories || [],
                country: organizer.country,
                socialLinks: {
                    website: organizer.website,
                    ...organizer.socialLinks
                },
                stats: {
                    followersCount: organizer.followers?.length || 0,
                    totalEvents: await Event.countDocuments({ 
                        $or: [
                            { organizer: organizer.user?._id },
                            { organizerProfile: organizer._id }
                        ], 
                        status: 'published' 
                    })
                }
            };
        } else {
            profileData = {
                ...organizer.toObject(),
                stats: {
                    followersCount: organizer.followers?.length || 0,
                    totalEvents: await Event.countDocuments({ organizer: organizer._id, status: 'published' })
                }
            };
        }

        res.json({
            success: true,
            data: profileData
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
        const searchId = id.toLowerCase();
        let organizer;
        let organizationId = null;
        let userId = null;

        // Try Organization first
        if (mongoose.Types.ObjectId.isValid(id)) {
            organizer = await mongoose.model('Organizer').findById(id);
        }
        if (!organizer) {
            organizer = await mongoose.model('Organizer').findOne({ slug: searchId });
        }

        if (organizer) {
            organizationId = organizer._id;
            userId = organizer.user;
        } else {
            // Try User fallback
            if (mongoose.Types.ObjectId.isValid(id)) {
                organizer = await User.findById(id);
            }
            if (!organizer) {
                organizer = await User.findOne({ slug: searchId });
            }
            if (organizer) userId = organizer._id;
        }

        if (!userId && !organizationId) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        const { type } = req.query;
        const now = new Date();

        let query = {
            status: 'published'
        };
        
        if (organizationId) {
            query.organizerProfile = organizationId;
        } else if (userId) {
            query.organizer = userId;
        }

        if (type === 'upcoming') {
            query.endDate = { $gte: now };
        } else if (type === 'past') {
            query.endDate = { $lt: now };
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

        let target = null;
        let targetType = 'User';

        // 1. Try finding Organizer (Dedicated Profile)
        if (mongoose.Types.ObjectId.isValid(id)) {
            target = await mongoose.model('Organizer').findById(id);
        }
        if (!target) {
            target = await mongoose.model('Organizer').findOne({ slug: id.toLowerCase() });
        }

        if (target) {
            targetType = 'Organizer';
        } else {
            // 2. Fallback to User
            if (mongoose.Types.ObjectId.isValid(id)) {
                target = await User.findById(id);
            }
            if (!target) {
                target = await User.findOne({ slug: id.toLowerCase() });
            }
        }

        if (!target) return res.status(404).json({ message: 'Target not found' });

        const user = await User.findById(userId);
        const targetIsUser = targetType === 'User' && target._id.toString() === userId.toString();
        const actualTarget = targetIsUser ? user : target;

        const isFollowing = actualTarget.followers.some(fid => fid.toString() === userId.toString());

        if (isFollowing) {
            // Unfollow
            actualTarget.followers = actualTarget.followers.filter(fid => fid.toString() !== userId.toString());
            user.followedOrganizers = user.followedOrganizers.filter(fid => fid.toString() !== target._id.toString());
        } else {
            // Follow
            actualTarget.followers.push(userId);
            user.followedOrganizers.push(target._id);
        }

        if (targetIsUser) {
            await user.save();
        } else {
            await Promise.all([target.save(), user.save()]);
        }

        res.json({
            success: true,
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing,
            followersCount: actualTarget.followers.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Contact Organizer
// @route   POST /api/organizers/:id/contact
exports.contactOrganizer = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, subject, message } = req.body;

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        let target = null;
        let isDedicatedOrg = false;

        // Try Organizer first
        if (mongoose.Types.ObjectId.isValid(id)) {
            target = await mongoose.model('Organizer').findById(id).populate('user');
        }
        if (!target) {
            target = await mongoose.model('Organizer').findOne({ slug: id.toLowerCase() }).populate('user');
        }

        if (target) isDedicatedOrg = true;

        if (!target) {
            // Try User
            if (mongoose.Types.ObjectId.isValid(id)) {
                target = await User.findById(id);
            }
            if (!target) {
                target = await User.findOne({ slug: id.toLowerCase() });
            }
        }

        if (!target) return res.status(404).json({ success: false, message: 'Organizer not found' });

        const organizerEmail = isDedicatedOrg ? target.user?.email : target.email;
        const organizerName = isDedicatedOrg ? target.name : target.username;

        if (!organizerEmail) {
            return res.status(400).json({ success: false, message: 'Organizer contact email not found' });
        }

        // 1. Save Inquiry to DB
        const Inquiry = require('../models/inquiry.model');
        await Inquiry.create({
            fullName,
            email,
            subject,
            message,
            organizer: target._id,
            type: 'organizer'
        });

        // 2. Send Email to Organizer
        const emailService = require('../services/email.service');
        await emailService.sendOrganizerContactEmail(
            organizerEmail,
            organizerName,
            { fullName, email },
            subject,
            message
        );

        res.json({
            success: true,
            message: 'Your message has been sent to the organizer successfully.'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
