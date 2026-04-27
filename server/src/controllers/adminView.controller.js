const User = require('../models/user.model');
const Event = require('../models/event.model');
const Category = require('../models/category.model');
const Booking = require('../models/booking.model');
const AppSetting = require('../models/appSetting.model');
const Inquiry = require('../models/inquiry.model');
const StaticPage = require('../models/staticPage.model');
const FAQ = require('../models/faq.model');
const Role = require('../models/role.model');
const Transaction = require('../models/transaction.model');
const Payout = require('../models/payout.model');
const jwt = require('jsonwebtoken');
const stripeService = require('../services/stripe.service');

// @desc    Show Admin Login Page
// @route   GET /admin/login
exports.getLoginPage = (req, res) => {
    res.render('auth/login', {
        layout: false,
        error: req.query.error || null
    });
};

// @desc    Handle Admin Login
// @route   POST /admin/login
exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('roles');

        if (!user || !user.roles.some(r => r.slug === 'administrator')) {
            return res.redirect('/admin/login?error=Invalid credentials or unauthorized access');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.redirect('/admin/login?error=Invalid email or password');
        }

        // Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        // Set Cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        res.redirect(`/admin/login?error=${error.message}`);
    }
};

// @desc    Handle Admin Logout
// @route   GET /admin/logout
exports.logout = (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
};

// @desc    Dashboard Page
// @route   GET /admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        let settings = await AppSetting.findOne();
        if (!settings) settings = await AppSetting.create({});

        // Seed default currencies if missing
        if (!settings.currencies || settings.currencies.length === 0) {
            settings.currencies = [
                { code: 'GBP', symbol: '£', rate: 1, isActive: true, country: 'United Kingdom', countryCode: 'uk' },
                { code: 'USD', symbol: '$', rate: 1.25, isActive: true, country: 'USA', countryCode: 'us' },
                { code: 'AUD', symbol: 'A$', rate: 1.9, isActive: true, country: 'Australia', countryCode: 'au' },
                { code: 'EUR', symbol: '€', rate: 1.15, isActive: true, country: 'Ireland', countryCode: 'ie' }
            ];
            await settings.save();
            const stripeService = require('../services/stripe.service');
            await stripeService.syncCurrencyRates();
        }

        const stats = {
            users: await User.countDocuments(),
            events: await Event.countDocuments(),
            bookings: await Booking.countDocuments(),
            inquiries: await Inquiry.countDocuments({ status: 'new' })
        };

        const recentBookings = await Booking.find()
            .populate('user_id', 'username email')
            .populate('event_id', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        res.render('pages/dashboard', {
            activePage: 'dashboard',
            admin: req.user,
            stats,
            recentBookings
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Settings Page
// @route   GET /admin/settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await AppSetting.findOne();
        if (!settings) settings = await AppSetting.create({});

        // Seed default currencies if missing
        if (!settings.currencies || settings.currencies.length === 0) {
            settings.currencies = [
                { code: 'GBP', symbol: '£', rate: 1, isActive: true, country: 'United Kingdom', countryCode: 'uk' },
                { code: 'USD', symbol: '$', rate: 1.25, isActive: true, country: 'USA', countryCode: 'us' },
                { code: 'AUD', symbol: 'A$', rate: 1.9, isActive: true, country: 'Australia', countryCode: 'au' },
                { code: 'EUR', symbol: '€', rate: 1.15, isActive: true, country: 'Ireland', countryCode: 'ie' }
            ];
            await settings.save();

            // Immediate sync to get fresh rates
            const stripeService = require('../services/stripe.service');
            await stripeService.syncCurrencyRates();
        }

        if (!settings.socialLogin) {
            settings.socialLogin = {
                google: { isActive: false },
                meta: { isActive: false },
                apple: { isActive: false }
            };
        }

        if (!settings.smtp) {
            settings.smtp = {
                host: '',
                port: 587,
                user: '',
                pass: '',
                fromEmail: '',
                fromName: 'HalalBrite'
            };
        }

        res.render('pages/settings', {
            activePage: 'settings',
            admin: req.user,
            settings,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Update Settings
// @route   POST /admin/settings/update
exports.updateSettings = async (req, res) => {
    try {
        const updateData = { ...req.body };
        const settings = await AppSetting.findOne();

        if (!settings) {
            await AppSetting.create(updateData);
            return res.redirect('/admin/settings?success=Settings created successfully');
        }

        // Security: Preserve masked keys
        if (updateData.stripe) {
            if (updateData.stripe.testSecretKey && updateData.stripe.testSecretKey.includes('•')) delete updateData.stripe.testSecretKey;
            if (updateData.stripe.liveSecretKey && updateData.stripe.liveSecretKey.includes('•')) delete updateData.stripe.liveSecretKey;
        }

        if (updateData.smtp) {
            if (updateData.smtp.pass && updateData.smtp.pass.includes('•')) delete updateData.smtp.pass;
            if (updateData.smtp.port) updateData.smtp.port = parseInt(updateData.smtp.port);
        }

        if (updateData.socialLogin) {
            ['google', 'meta', 'apple'].forEach(provider => {
                if (updateData.socialLogin[provider]) {
                    updateData.socialLogin[provider].isActive = updateData.socialLogin[provider].isActive === 'on';
                    if (updateData.socialLogin[provider].clientSecret && updateData.socialLogin[provider].clientSecret.includes('•')) {
                        delete updateData.socialLogin[provider].clientSecret;
                    }
                    if (updateData.socialLogin[provider].privateKey && updateData.socialLogin[provider].privateKey.includes('•')) {
                        delete updateData.socialLogin[provider].privateKey;
                    }
                }
            });
        }

        // Handle Currencies
        if (updateData.currencies) {
            const currenciesArray = Object.values(updateData.currencies).map(c => ({
                ...c,
                isActive: c.isActive === 'on',
                rate: parseFloat(c.rate) || 1
            }));
            settings.currencies = currenciesArray;
            delete updateData.currencies;
        }

        // Generic Deep Merge
        Object.keys(updateData).forEach(key => {
            if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
                if (!settings[key]) settings[key] = {};

                Object.keys(updateData[key]).forEach(subKey => {
                    if (typeof updateData[key][subKey] === 'object' && updateData[key][subKey] !== null) {
                        if (!settings[key][subKey]) settings[key][subKey] = {};
                        Object.assign(settings[key][subKey], updateData[key][subKey]);
                    } else {
                        settings[key][subKey] = updateData[key][subKey];
                    }
                });
                settings.markModified(key);
            } else {
                settings[key] = updateData[key];
            }
        });

        await settings.save();

        res.redirect('/admin/settings?success=Settings updated successfully');
    } catch (error) {
        res.redirect(`/admin/settings?error=${error.message}`);
    }
};

// @desc    Sync Currency Rates with Stripe
// @route   POST /admin/settings/sync-rates
exports.syncCurrencyRates = async (req, res) => {
    try {
        await stripeService.syncCurrencyRates();
        res.redirect('/admin/settings?success=Currency rates synced with Stripe');
    } catch (error) {
        res.redirect(`/admin/settings?error=${error.message}`);
    }
};

// @desc    User Management
// @route   GET /admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roles').sort({ createdAt: -1 });
        res.render('pages/users', {
            activePage: 'users',
            admin: req.user,
            users
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    User Creation/Edit Form
// @route   GET /admin/users/add OR /admin/users/edit/:id
exports.getUserForm = async (req, res) => {
    try {
        let user = null;
        if (req.params.id) {
            user = await User.findById(req.params.id).populate('roles');
        }
        const roles = await Role.find().sort({ name: 1 });

        res.render('pages/user_form', {
            activePage: 'users',
            admin: req.user,
            user,
            roles
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Save User
// @route   POST /admin/users/save
exports.saveUser = async (req, res) => {
    try {
        console.log('📝 Saving user:', req.body);
        const { id, username, email, password, role, status } = req.body;

        const data = {
            username,
            email,
            role,
            status: status || 'active'
        };

        if (id) {
            console.log('🔄 Updating existing user:', id);
            const user = await User.findById(id);
            if (!user) return res.status(404).send('User not found');

            // Only update password if provided
            if (password && password.trim() !== '') {
                user.password = password;
            }

            user.username = username;
            user.email = email;
            user.roles = [role];
            user.status = status;
            await user.save();
            console.log('✅ User updated successfully');
        } else {
            console.log('✨ Creating new user');
            if (!password) {
                return res.status(400).send('Password is required for new users');
            }
            const newUser = await User.create({
                ...data,
                roles: [role],
                password
            });
            console.log('✅ User created successfully:', newUser._id);
        }
        res.redirect('/admin/users?success=User saved successfully');
    } catch (error) {
        console.error('❌ Error saving user:', error);
        res.status(500).send(error.message);
    }
};

// @desc    Event Management
// @route   GET /admin/events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('category').populate('organizer', 'username').sort({ createdAt: -1 });
        res.render('pages/events', {
            activePage: 'events',
            admin: req.user,
            events
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Category Management
// @route   GET /admin/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.render('pages/categories', {
            activePage: 'categories',
            admin: req.user,
            categories
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    CMS / Static Pages
// @route   GET /admin/cms
exports.getCMS = async (req, res) => {
    try {
        const pages = await StaticPage.find().sort({ title: 1 });
        res.render('pages/cms', {
            activePage: 'cms',
            admin: req.user,
            pages
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Inquiry Management
// @route   GET /admin/inquiries
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.render('pages/inquiries', {
            activePage: 'inquiries',
            admin: req.user,
            inquiries
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    FAQ Management
// @route   GET /admin/faqs
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ category: 1, order: 1 });
        res.render('pages/faqs', {
            activePage: 'faqs',
            admin: req.user,
            faqs
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Orders & Payments
// @route   GET /admin/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Booking.find()
            .populate('user_id', 'username email')
            .populate('event_id', 'title')
            .sort({ createdAt: -1 });
        res.render('pages/orders', {
            activePage: 'orders',
            admin: req.user,
            orders
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    View Order Detail
// @route   GET /admin/orders/view/:id
exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Booking.findById(req.params.id)
            .populate('user_id', 'username email')
            .populate('event_id', 'title');
        
        if (!order) return res.status(404).send('Order not found');

        res.render('pages/order_detail', {
            activePage: 'orders',
            admin: req.user,
            order
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    FAQ Creation/Edit Form
// @route   GET /admin/faqs/add OR /admin/faqs/edit/:id
exports.getFAQForm = async (req, res) => {
    try {
        let faq = null;
        if (req.params.id) {
            faq = await FAQ.findById(req.params.id);
        }
        res.render('pages/faq_form', {
            activePage: 'faqs',
            admin: req.user,
            faq
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Save FAQ (Create or Update)
// @route   POST /admin/faqs/save
exports.saveFAQ = async (req, res) => {
    try {
        const { id, question, answer, category, order, isActive } = req.body;
        const data = {
            question,
            answer,
            category,
            order: parseInt(order) || 0,
            isActive: isActive === 'on'
        };

        if (id) {
            await FAQ.findByIdAndUpdate(id, data);
        } else {
            await FAQ.create(data);
        }
        res.redirect('/admin/faqs?success=FAQ saved successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    CMS Creation/Edit Form
// @route   GET /admin/cms/add OR /admin/cms/edit/:id
exports.getCMSForm = async (req, res) => {
    try {
        let page = null;
        if (req.params.id) {
            page = await StaticPage.findById(req.params.id);
        }
        res.render('pages/cms_form', {
            activePage: 'cms',
            admin: req.user,
            page
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Save Static Page
// @route   POST /admin/cms/save
exports.saveCMS = async (req, res) => {
    try {
        const { id, title, slug, content } = req.body;
        const data = { title, slug, content, lastUpdatedBy: req.user._id };

        if (id) {
            await StaticPage.findByIdAndUpdate(id, data);
        } else {
            await StaticPage.create(data);
        }
        res.redirect('/admin/cms?success=Page saved successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Event Creation/Edit Form
// @route   GET /admin/events/add OR /admin/events/edit/:id
exports.getEventForm = async (req, res) => {
    try {
        let event = null;
        if (req.params.id) {
            event = await Event.findById(req.params.id);
        }

        const [categories, settings, adminRole, organizerRole] = await Promise.all([
            Category.find().sort({ name: 1 }),
            AppSetting.findOne(),
            Role.findOne({ slug: 'administrator' }),
            Role.findOne({ slug: 'organizer' })
        ]);

        const organizers = await User.find({
            roles: { $in: [adminRole?._id, organizerRole?._id].filter(id => id) }
        }).select('username _id').sort({ username: 1 });

        res.render('pages/event_form', {
            activePage: 'events',
            admin: req.user,
            event: event,
            categories: categories,
            settings: settings || { platform: {} },
            allOrganizers: organizers || [],
            platformFeePercent: settings?.platform?.feePercentage || 0,
            platformFixedFee: settings?.platform?.fixedFee || 0,
            vatRate: settings?.platform?.vatRate || 0,
            stripePercent: settings?.platform?.stripeFeePercentage || 0,
            stripeFixed: settings?.platform?.fixedStripeFee || 0,
            currentCurrencySymbol: settings?.platform?.currency === 'EUR' ? '€' : settings?.platform?.currency === 'USD' ? '$' : '£'
        });
    } catch (error) {
        console.error('Error in getEventForm:', error);
        res.status(500).send(error.message);
    }
};

// @desc    Save Event
// @route   POST /admin/events/save
exports.saveEvent = async (req, res) => {
    try {
        const {
            id, title, description, category, eventType,
            startDate, endDate, startTime, endTime,
            status, thumbnailOption, banner, thumbnail,
            organizerName, capacity
        } = req.body;

        // Combine Event Date and Time
        const combinedStart = new Date(`${startDate}T${startTime || '00:00'}`);
        const combinedEnd = new Date(`${endDate}T${endTime || '00:00'}`);

        // Complex object construction for location
        const location = {
            venueName: req.body.venueName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            postcode: req.body.postcode,
            country: req.body.country || 'UK'
        };

        // Handle ticket types
        const ticketNames = Array.isArray(req.body.ticketName) ? req.body.ticketName : [req.body.ticketName];
        const ticketPrices = Array.isArray(req.body.ticketPrice) ? req.body.ticketPrice : [req.body.ticketPrice];
        const ticketQtys = Array.isArray(req.body.ticketQuantity) ? req.body.ticketQuantity : [req.body.ticketQuantity];
        const ticketDescriptions = Array.isArray(req.body.ticketDescription) ? req.body.ticketDescription : [req.body.ticketDescription];
        const ticketSaleStarts = Array.isArray(req.body.ticketSaleStartDate) ? req.body.ticketSaleStartDate : [req.body.ticketSaleStartDate];
        const ticketSaleStartTimes = Array.isArray(req.body.ticketSaleStartTime) ? req.body.ticketSaleStartTime : [req.body.ticketSaleStartTime];
        const ticketSaleEnds = Array.isArray(req.body.ticketSaleEndDate) ? req.body.ticketSaleEndDate : [req.body.ticketSaleEndDate];
        const ticketSaleEndTimes = Array.isArray(req.body.ticketSaleEndTime) ? req.body.ticketSaleEndTime : [req.body.ticketSaleEndTime];

        // Fee components
        const platformFees = Array.isArray(req.body.ticketPlatformFee) ? req.body.ticketPlatformFee : [req.body.ticketPlatformFee];
        const vatFees = Array.isArray(req.body.ticketVatFee) ? req.body.ticketVatFee : [req.body.ticketVatFee];
        const stripeFees = Array.isArray(req.body.ticketStripeFee) ? req.body.ticketStripeFee : [req.body.ticketStripeFee];
        const totalFees = Array.isArray(req.body.ticketTotalFees) ? req.body.ticketTotalFees : [req.body.ticketTotalFees];

        const ticketTypes = ticketNames.filter(n => n).map((name, i) => {
            const sDate = ticketSaleStarts[i];
            const sTime = ticketSaleStartTimes[i] || '00:00';
            const eDate = ticketSaleEnds[i];
            const eTime = ticketSaleEndTimes[i] || '00:00';

            return {
                name,
                description: ticketDescriptions[i],
                price: parseFloat(ticketPrices[i]) || 0,
                quantity: parseInt(ticketQtys[i]) || 0,
                saleStart: sDate ? new Date(`${sDate}T${sTime}`) : undefined,
                saleEnd: eDate ? new Date(`${eDate}T${eTime}`) : undefined,
                platformFee: parseFloat(platformFees[i]) || 0,
                vatOnPlatformFee: parseFloat(vatFees[i]) || 0,
                stripeProcessingFee: parseFloat(stripeFees[i]) || 0,
                totalFees: parseFloat(totalFees[i]) || 0
            };
        });

        const data = {
            title,
            description,
            category,
            eventType,
            startDate: combinedStart,
            endDate: combinedEnd,
            startTime,
            endTime,
            location,
            ticketTypes,
            banner,
            thumbnail: thumbnailOption === 'same' ? banner : thumbnail,
            thumbnailOption,
            status: status || 'published',
            organizer: req.user._id,
            organizerName: organizerName || req.user.username,
            feePayment: req.body.feePayment === 'on', // Handled by toggle
            capacity: parseInt(capacity) || undefined
        };

        if (id) {
            await Event.findByIdAndUpdate(id, data);
        } else {
            await Event.create(data);
        }
        res.redirect('/admin/events?success=Event saved successfully');
    } catch (error) {
        res.redirect(`/admin/events/add?error=${error.message}`);
    }
};

// @desc    Event Detail View
// @route   GET /admin/events/view/:id
exports.getEventDetail = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('category')
            .populate('organizer', 'username email');

        if (!event) return res.status(404).send('Event not found');

        const bookingsCount = await Booking.countDocuments({ event_id: event._id });

        res.render('pages/event_view', {
            activePage: 'events',
            admin: req.user,
            event,
            bookingsCount
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Category Form
// @route   GET /admin/categories/add OR /admin/categories/edit/:id
exports.getCategoryForm = async (req, res) => {
    try {
        let category = null;
        if (req.params.id) {
            category = await Category.findById(req.params.id);
        }
        res.render('pages/category_form', {
            activePage: 'categories',
            admin: req.user,
            category
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Save Category
// @route   POST /admin/categories/save
exports.saveCategory = async (req, res) => {
    try {
        const { id, name, slug, image } = req.body;
        const data = { name, slug, image };

        if (id) {
            await Category.findByIdAndUpdate(id, data);
        } else {
            await Category.create(data);
        }
        res.redirect('/admin/categories?success=Category saved successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Generic Delete Handler
// @route   POST /admin/:resource/delete/:id
exports.handleDelete = async (req, res) => {
    try {
        const { resource, id } = req.params;
        let model;
        let redirectUrl = `/admin/${resource}`;

        switch (resource) {
            case 'users': model = User; break;
            case 'events': model = Event; break;
            case 'categories': model = Category; break;
            case 'cms': model = StaticPage; break;
            case 'faqs': model = FAQ; break;
            case 'inquiries': model = Inquiry; break;
            default: return res.status(400).send('Invalid resource');
        }

        await model.findByIdAndDelete(id);
        res.redirect(`${redirectUrl}?success=Item deleted successfully`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    View Stripe Connected Organizers
// @route   GET /admin/stripe/organizers
exports.getStripeOrganizers = async (req, res) => {
    try {
        // Find users who have connected Stripe (supporting both legacy and new field names)
        const rawOrganizers = await User.find({
            $or: [
                { stripe_account_id: { $exists: true, $ne: null, $ne: '' } },
                { stripeConnectedId: { $exists: true, $ne: null, $ne: '' } }
            ]
        }).select('username email stripe_account_id stripeConnectedId createdAt').sort({ createdAt: -1 });

        console.log(`🔍 Found ${rawOrganizers.length} raw organizers in DB`);

        // Enrich organizers with real-time balance and aggregation data
        const organizers = await Promise.all(rawOrganizers.map(async (org) => {
            const orgObj = org.toObject();
            const accountId = org.stripeConnectedId || org.stripe_account_id;

            // 1. Fetch Stripe Balance
            let availableBalance = 0;
            try {
                const balance = await stripeService.getAccountBalance(accountId);
                // Balance is an array of currencies
                availableBalance = balance.available.reduce((sum, b) => sum + (b.amount / 100), 0);
            } catch (err) {
                console.error(`Could not fetch balance for ${accountId}:`, err.message);
            }

            // 2. Aggregate Total Earned (from Transactions)
            const earnings = await Transaction.aggregate([
                { $match: { organizer_id: org._id, status: 'completed', type: 'sale' } },
                { $group: { _id: null, total: { $sum: '$organizer_amount' } } }
            ]);

            // 3. Aggregate Total Payouts (from Payouts)
            const payouts = await Payout.aggregate([
                { $match: { organizer_id: org._id, status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            return {
                ...orgObj,
                accountId: accountId,
                stripeConnectedId: accountId, // Duplicate for template safety
                availableBalance: availableBalance || 0,
                totalEarned: earnings[0]?.total || 0,
                totalPayouts: payouts[0]?.total || 0
            };
        }));

        res.render('pages/admin/stripe_organizers', {
            activePage: 'stripe',
            activeSubPage: 'organizers',
            admin: req.user,
            organizers
        });
    } catch (error) {
        console.error('Error in getStripeOrganizers:', error);
        res.status(500).send(error.message);
    }
};
// @desc    Generate Stripe Login Link and Redirect
// @route   GET /admin/stripe/login-link/:id
exports.getStripeLoginLink = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        const accountId = user.stripeConnectedId || user.stripe_account_id;
        if (!accountId) return res.status(400).send('Stripe account not connected');

        const loginLink = await stripeService.createLoginLink(accountId);
        res.redirect(loginLink.url);
    } catch (error) {
        console.error('Error generating login link:', error);
        res.status(500).send(error.message);
    }
};


// @desc    View Platform Transactions
// @route   GET /admin/stripe/transactions
exports.getStripeTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('organizer_id', 'username')
            .populate('event_id', 'title')
            .sort({ createdAt: -1 })
            .limit(100);

        const stats = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalPlatformFee: { $sum: '$platform_fee' },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.render('pages/admin/stripe_transactions', {
            activePage: 'stripe',
            activeSubPage: 'transactions',
            admin: req.user,
            transactions,
            stats: stats[0] || { totalPlatformFee: 0, totalVat: 0, totalStripeFee: 0, totalAmount: 0 }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    View Stripe Main Dashboard
// @route   GET /admin/stripe/dashboard
exports.getStripeDashboard = async (req, res) => {
    try {
        let stats = { totalPayouts: 0, platformRevenue: 0, ticketsSold: 0 };
        let notConfigured = false;

        const settings = await AppSetting.findOne();

        try {
            stats = await stripeService.getDashboardStats();
        } catch (err) {
            if (err.message.includes('Secret Key not found')) {
                notConfigured = true;
            } else {
                throw err;
            }
        }

        const connectedOrganizers = await User.countDocuments({ stripe_account_id: { $ne: null } });

        res.render('pages/admin/stripe_dashboard', {
            activePage: 'stripe',
            activeSubPage: 'overview',
            admin: req.user,
            stats: { ...stats, connectedOrganizers },
            settings,
            notConfigured
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    View Stripe Settings
// @route   GET /admin/stripe/settings
exports.getStripeSettings = async (req, res) => {
    try {
        const settings = await AppSetting.findOne();
        res.render('pages/admin/stripe_settings', {
            activePage: 'stripe',
            activeSubPage: 'settings',
            admin: req.user,
            settings,
            host: req.get('host')
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// @desc    Update Stripe Settings
// @route   POST /admin/stripe/settings/save
exports.saveStripeSettings = async (req, res) => {
    try {
        const settings = await AppSetting.findOne() || new AppSetting();

        // Update Stripe Keys
        settings.stripe = {
            ...settings.stripe,
            isTestMode: req.body.isTestMode === 'on',
            testSecretKey: req.body.testSecretKey,
            testPublishableKey: req.body.testPublishableKey,
            testClientId: req.body.testClientId,
            liveSecretKey: req.body.liveSecretKey,
            livePublishableKey: req.body.livePublishableKey,
            liveClientId: req.body.liveClientId,
            webhookSecret: req.body.webhookSecret
        };

        // Update Platform configuration
        settings.platform = {
            ...settings.platform,
            feePercentage: parseFloat(req.body.feePercentage) || 0,
            fixedFee: parseFloat(req.body.fixedFee) || 0,
            vatRate: parseFloat(req.body.vatRate) || 0,
            stripeFeePercentage: parseFloat(req.body.stripeFeePercentage) || 0,
            fixedStripeFee: parseFloat(req.body.fixedStripeFee) || 0,
            currency: req.body.currency || 'EUR',
            payoutThreshold: parseFloat(req.body.payoutThreshold) || 0,
            payoutSchedule: req.body.payoutSchedule || 'Manual'
        };

        await settings.save();
        res.redirect('/admin/stripe/settings?success=Stripe settings updated successfully');
    } catch (error) {
        res.redirect(`/admin/stripe/settings?error=${error.message}`);
    }
};

// @desc    Manual Sync Payouts from Stripe
// @route   POST /admin/stripe/sync
exports.syncStripePayouts = async (req, res) => {
    try {
        const result = await stripeService.syncPayouts();
        const successMsg = `Sync Summary: Transfers: ${result.syncedTransfers}, Payouts: ${result.syncedPayouts}, Organizers: ${result.organizersProcessed}`;
        res.redirect('/admin/stripe/settings?success=' + encodeURIComponent(successMsg));
    } catch (error) {
        res.redirect(`/admin/stripe/settings?error=${encodeURIComponent(error.message)}`);
    }
};

// @desc    Disconnect Stripe Account
// @route   POST /admin/stripe/disconnect
exports.disconnectStripe = async (req, res) => {
    try {
        const settings = await AppSetting.findOne();
        if (settings) {
            settings.stripe = {
                isTestMode: true,
                testSecretKey: '',
                testPublishableKey: '',
                testClientId: '',
                liveSecretKey: '',
                livePublishableKey: '',
                liveClientId: '',
                webhookSecret: ''
            };
            await settings.save();
        }
        res.redirect('/admin/stripe/dashboard?success=Stripe account disconnected successfully');
    } catch (error) {
        res.redirect(`/admin/stripe/dashboard?error=${encodeURIComponent(error.message)}`);
    }
};
