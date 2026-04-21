const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password').populate('roles');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...requiredPermissions) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.roles || req.user.roles.length === 0) {
            return res.status(403).json({ message: 'Forbidden: No roles assigned' });
        }

        // Administrator always has access
        const isAdministrator = req.user.roles.some(role => role.slug === 'administrator');
        if (isAdministrator) {
            return next();
        }

        const hasPermission = requiredPermissions.some(permission => 
            req.user.roles.some(role => role.permissions && role.permissions.includes(permission))
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};

module.exports = { protect, authorize };
