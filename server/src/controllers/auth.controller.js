const User = require('../models/user.model');
const Role = require('../models/role.model');
const jwt = require('jsonwebtoken');
const socialAuthService = require('../services/socialAuth.service');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Assign role (Organizer or Attendee)
        let roleSlug = 'attendee';
        if (role && (role.toLowerCase() === 'organizer' || role.toLowerCase() === 'organiser')) {
            roleSlug = 'organizer';
        }
        
        const selectedRole = await Role.findOne({ slug: roleSlug });
        
        const user = await User.create({
            username,
            email,
            password,
            roles: selectedRole ? [selectedRole._id] : []
        });

        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: selectedRole ? [selectedRole.slug] : ['attendee'],
                    stripeConnectedId: user.stripeConnectedId || null,
                    token: generateToken(user._id),
                    savedEvents: user.savedEvents || [],
                    followedOrganizers: user.followedOrganizers || [],
                    addresses: user.addresses || []
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('roles');

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles.map(r => r.slug),
                stripeConnectedId: user.stripeConnectedId || null,
                token: generateToken(user._id),
                savedEvents: user.savedEvents || [],
                followedOrganizers: user.followedOrganizers || [],
                addresses: user.addresses || []
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Social Login (Auth0)
// @route   POST /api/auth/social-login
// @access  Public
exports.socialLogin = async (req, res) => {
    const { email, username, auth0Id, avatar } = req.body;

    try {
        if (!auth0Id) {
            return res.status(400).json({ message: 'Auth0 ID is required for social login' });
        }

        // 1. Find user by Auth0 ID
        let user = await User.findOne({ auth0Id }).populate('roles');

        // 2. If not found by Auth0 ID, check by email to link accounts
        if (!user && email) {
            user = await User.findOne({ email }).populate('roles');
            if (user) {
                // Link existing email account to Auth0
                user.auth0Id = auth0Id;
                user.isSocialLogin = true;
                await user.save();
            }
        }

        // 3. If still not found, create new social user
        if (!user) {
            const attendeeRole = await Role.findOne({ slug: 'attendee' });
            user = await User.create({
                username: username || email.split('@')[0] + Math.floor(Math.random() * 1000),
                email,
                auth0Id,
                isSocialLogin: true,
                avatar,
                roles: attendeeRole ? [attendeeRole._id] : [],
                status: 'active'
            });
            user = await user.populate('roles');
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles.map(r => r.slug),
            token: generateToken(user._id),
            isSocialLogin: user.isSocialLogin,
            savedEvents: user.savedEvents || [],
            followedOrganizers: user.followedOrganizers || [],
            addresses: user.addresses || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('roles');
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            bio: user.bio,
            avatar: user.avatar,
            roles: user.roles.map(r => r.slug),
            stripeConnectedId: user.stripeConnectedId || null,
            savedEvents: user.savedEvents || [],
            followedOrganizers: user.followedOrganizers || [],
            addresses: user.addresses || []
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * Common handler for all social logins
 */
const handleSocialLogin = async (res, socialData, provider) => {
    try {
        const { id, email, name, picture } = socialData;
        const socialIdField = `${provider}Id`; // e.g. googleId, metaId, appleId

        // 1. Find user by provider ID
        let user = await User.findOne({ [socialIdField]: id }).populate('roles');

        // 2. If not found, check by email to link accounts
        if (!user && email) {
            user = await User.findOne({ email }).populate('roles');
            if (user) {
                user[socialIdField] = id;
                user.isSocialLogin = true;
                if (!user.avatar && picture) user.avatar = picture;
                await user.save();
            }
        }

        // 3. If still not found, create new social user
        if (!user) {
            const attendeeRole = await Role.findOne({ slug: 'attendee' });
            user = await User.create({
                username: (name ? name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0]) + Math.floor(Math.random() * 1000),
                email: email || `${id}@${provider}.com`,
                [socialIdField]: id,
                isSocialLogin: true,
                avatar: picture,
                firstName: name ? name.split(' ')[0] : '',
                lastName: name ? name.split(' ').slice(1).join(' ') : '',
                roles: attendeeRole ? [attendeeRole._id] : [],
                status: 'active'
            });
            user = await user.populate('roles');
        }

        res.json({
            success: true,
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles.map(r => r.slug),
            token: generateToken(user._id),
            isSocialLogin: user.isSocialLogin,
            savedEvents: user.savedEvents || [],
            followedOrganizers: user.followedOrganizers || [],
            addresses: user.addresses || []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ message: 'Google ID Token is required' });
        
        const socialData = await socialAuthService.verifyGoogleToken(idToken);
        await handleSocialLogin(res, socialData, 'google');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Meta (Facebook) Login
// @route   POST /api/auth/facebook
// @access  Public
exports.facebookLogin = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) return res.status(400).json({ message: 'Facebook Access Token is required' });
        
        const socialData = await socialAuthService.verifyMetaToken(accessToken);
        await handleSocialLogin(res, socialData, 'meta');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apple Login
// @route   POST /api/auth/apple
// @access  Public
exports.appleLogin = async (req, res) => {
    try {
        const { identityToken } = req.body;
        if (!identityToken) return res.status(400).json({ message: 'Apple Identity Token is required' });
        
        const socialData = await socialAuthService.verifyAppleToken(identityToken);
        await handleSocialLogin(res, socialData, 'apple');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.preferences = { ...user.preferences, ...req.body };
            await user.save();
            res.json(user.preferences);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile

// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.phone = req.body.phone || user.phone;
            user.bio = req.body.bio || user.bio;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            const populatedUser = await User.findById(updatedUser._id).populate('roles');

            res.json({
                _id: populatedUser._id,
                username: populatedUser.username,
                email: populatedUser.email,
                firstName: populatedUser.firstName,
                lastName: populatedUser.lastName,
                phone: populatedUser.phone,
                bio: populatedUser.bio,
                avatar: populatedUser.avatar,
                roles: populatedUser.roles.map(r => r.slug),
                stripeConnectedId: populatedUser.stripeConnectedId || null,
                token: generateToken(populatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Become an organizer
// @route   POST /api/auth/become-organizer
// @access  Private
exports.becomeOrganizer = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('roles');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const organizerRole = await Role.findOne({ slug: 'organizer' });
        const attendeeRole = await Role.findOne({ slug: 'attendee' });
        
        if (!organizerRole || !attendeeRole) {
            return res.status(500).json({ message: 'Required roles not found' });
        }

        // Add roles if not already present
        let rolesChanged = false;
        if (!user.roles.some(r => r.slug === 'organizer')) {
            user.roles.push(organizerRole._id);
            rolesChanged = true;
        }
        if (!user.roles.some(r => r.slug === 'attendee')) {
            user.roles.push(attendeeRole._id);
            rolesChanged = true;
        }

        if (rolesChanged) {
            await user.save();
        }

        const updatedUser = await User.findById(user._id).populate('roles');
        res.json({
            message: 'User upgraded to Organizer and Attendee',
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            roles: updatedUser.roles.map(r => r.slug),
            stripeConnectedId: updatedUser.stripeConnectedId || null,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.preferences = { ...user.preferences, ...req.body };
        await user.save();

        res.json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
