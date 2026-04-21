const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');

// Middleware to protect admin views
exports.protectAdminView = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.adminToken) {
        token = req.cookies.adminToken;
    }

    if (!token) {
        return res.redirect('/admin/login?error=Session expired. Please login again.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user and roles
        const user = await User.findById(decoded.id).populate('roles');

        if (!user || !user.roles.some(r => r.slug === 'administrator')) {
            // Clear token and redirect if not admin
            res.clearCookie('adminToken');
            return res.redirect('/admin/login?error=Access denied. Administrative privileges required.');
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('adminToken');
        return res.redirect('/admin/login?error=Invalid session. Please login.');
    }
};

// Middleware to redirect if already logged in as admin
exports.redirectIfLoggedIn = async (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        try {
            const decoded = jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).populate('roles');
            if (user && user.roles.some(r => r.slug === 'administrator')) {
                return res.redirect('/admin/dashboard');
            }
        } catch (e) {
            res.clearCookie('adminToken');
        }
    }
    next();
};
