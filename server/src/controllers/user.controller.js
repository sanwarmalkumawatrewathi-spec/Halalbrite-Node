const User = require('../models/user.model');
const Role = require('../models/role.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).populate('roles').select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('roles').select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            if (req.body.roleId) {
                user.roles = [req.body.roleId];
            }
            user.status = req.body.status || user.status;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                message: 'User updated successfully',
                data: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    roles: updatedUser.roles,
                    status: updatedUser.status
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all roles
// @route   GET /api/users/roles
// @access  Private/Admin
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        
        // Group by role
        const roleStats = await User.aggregate([
            {
                $unwind: "$roles"
            },
            {
                $group: {
                    _id: "$roles",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "_id",
                    foreignField: "_id",
                    as: "roleInfo"
                }
            },
            {
                $unwind: "$roleInfo"
            },
            {
                $project: {
                    name: "$roleInfo.name",
                    slug: "$roleInfo.slug",
                    count: 1
                }
            }
        ]);

        // Get recent activity (last 5 users)
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('roles', 'name slug');

        res.json({
            totalUsers,
            roleDistribution: roleStats,
            recentActivity: recentUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upgrade current user to organizer
// @route   POST /api/users/upgrade-to-organizer
// @access  Private
exports.upgradeToOrganizer = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // 1. Find organizer role
        const organizerRole = await Role.findOne({ slug: 'organizer' });
        if (!organizerRole) {
            return res.status(500).json({ message: 'Organizer role not found in system. Please contact admin.' });
        }

        // 2. Update user roles (Append if not already present)
        const user = await User.findById(userId).populate('roles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already an organizer
        const alreadyOrganizer = user.roles.some(r => r.slug === 'organizer');
        if (alreadyOrganizer) {
            return res.status(400).json({ message: 'You already have organizer permissions.' });
        }

        user.roles.push(organizerRole._id);
        await user.save();

        res.json({
            success: true,
            message: 'Congratulations! Your account has been upgraded to Organiser. You now have both Attendee and Organiser permissions.',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles.map(r => r.slug)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
