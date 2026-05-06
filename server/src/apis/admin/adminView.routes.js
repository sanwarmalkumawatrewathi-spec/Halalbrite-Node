const express = require('express');
const router = express.Router();
const {
    getLoginPage,
    handleLogin,
    logout,
    getDashboard,
    getSettings,
    updateSettings,
    getUsers,
    getEvents,
    getCategories,
    getCMS,
    getInquiries,
    getFAQs,
    getOrders,
    getOrderDetail,
    getFAQForm,
    saveFAQ,
    getCMSForm,
    saveCMS,
    getCategoryForm,
    saveCategory,
    handleDelete,
    getEventForm,
    saveEvent,
    getEventDetail,
    getUserForm,
    saveUser,
    getStripeTransactions,
    getStripeDashboard,
    getStripeOrganizers,
    getStripeSettings,
    saveStripeSettings,
    syncStripePayouts,
    getStripeLoginLink,
    disconnectStripe,
    syncCurrencyRates,
    getAdminProfile,
    updateAdminProfile,
    markInquiryRead,
    getEmailLogs,
    markOrderPaid,
    getJobs,
    getAddJob,
    getEditJob,
    saveJob,
    deleteJobView
} = require('../../controllers/adminView.controller');
const { uploadSingle, handleUpload } = require('../../controllers/upload.controller');
const { protectAdminView, redirectIfLoggedIn } = require('../../middlewares/admin.middleware');

// Middleware to pass success messages to all views
router.use((req, res, next) => {
    res.locals.success = req.query.success || null;
    next();
});

// Public Admin Routes
router.route('/login')
    .get(redirectIfLoggedIn, getLoginPage)
    .post(handleLogin);

router.get('/logout', logout);

// Diagnostic Ping (Unprotected)
router.get('/ping', (req, res) => res.send('Admin Router is Reachable'));

// Protected Admin View Routes
router.use(protectAdminView);

// Admin Profile
router.get('/profile', protectAdminView, getAdminProfile);
router.post('/profile/update', protectAdminView, updateAdminProfile);

// Stripe Connect Management (Moved to top of protected section)
router.get('/stripe', getStripeDashboard);
router.get('/stripe/dashboard', getStripeDashboard);
router.get('/stripe/organizers', getStripeOrganizers);
router.get('/stripe/transactions', getStripeTransactions);
router.get('/stripe/settings', getStripeSettings);
router.post('/stripe/settings/save', saveStripeSettings);
router.post('/stripe/sync', syncStripePayouts);
router.get('/stripe/login-link/:id', getStripeLoginLink);
router.post('/stripe/disconnect', disconnectStripe);

router.get('/dashboard', getDashboard);
router.get('/settings', getSettings);
router.post('/settings/update', protectAdminView, updateSettings);
router.post('/settings/sync-rates', protectAdminView, syncCurrencyRates);

router.get('/users', protectAdminView, getUsers);
router.get('/events', protectAdminView, getEvents);
router.get('/categories', protectAdminView, getCategories);
router.get('/cms', protectAdminView, getCMS);
router.get('/inquiries', protectAdminView, getInquiries);
router.get('/faqs', protectAdminView, getFAQs);
router.get('/orders', protectAdminView, getOrders);
router.get('/orders/view/:id', protectAdminView, getOrderDetail);
router.post('/orders/mark-paid/:id', protectAdminView, markOrderPaid);

// User Management
router.get('/users', protectAdminView, getUsers);
router.get('/users/add', protectAdminView, getUserForm);
router.get('/users/edit/:id', protectAdminView, getUserForm);
router.post('/users/save', protectAdminView, saveUser);

// Event Management
router.get('/events/add', protectAdminView, getEventForm);
router.get('/events/edit/:id', protectAdminView, getEventForm);
router.post('/events/save', protectAdminView, saveEvent);
router.get('/events/view/:id', protectAdminView, getEventDetail);

// FAQ Management
router.get('/faqs/add', protectAdminView, getFAQForm);
router.get('/faqs/edit/:id', protectAdminView, getFAQForm);
router.post('/faqs/save', protectAdminView, saveFAQ);

// CMS Management
router.get('/cms/add', protectAdminView, getCMSForm);
router.get('/cms/edit/:id', protectAdminView, getCMSForm);
router.post('/cms/save', protectAdminView, saveCMS);

// Category Management
router.get('/categories/add', protectAdminView, getCategoryForm);
router.get('/categories/edit/:id', protectAdminView, getCategoryForm);
router.post('/categories/save', protectAdminView, saveCategory);


// Inquiry status
router.post('/inquiries/read/:id', protectAdminView, markInquiryRead);

// Email Logs
router.get('/email-logs', protectAdminView, getEmailLogs);

// Job Management
router.get('/jobs', protectAdminView, getJobs);
router.get('/jobs/add', protectAdminView, getAddJob);
router.get('/jobs/edit/:id', protectAdminView, getEditJob);
router.post('/jobs/save', protectAdminView, saveJob);
router.post('/jobs/delete/:id', protectAdminView, deleteJobView);

// Generic Delete
router.post('/:resource/delete/:id', protectAdminView, handleDelete);

// Image Upload API
router.post('/upload', protectAdminView, uploadSingle, handleUpload);

// Redirect base /admin to dashboard
router.get('/', (req, res) => res.redirect('/admin/dashboard'));

module.exports = router;
