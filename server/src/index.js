const express = require('express'); 
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Multi-Currency Middleware
const currencyMiddleware = require('./middlewares/currency.middleware');
app.use(currencyMiddleware);

// EJS Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is reachable' });
});

// Routes placeholder
app.get('/', (req, res) => {
    res.send('Halalbrite API is running...');
});

// Import and use routes
const authRoutes = require('./apis/auth/auth.routes');
const userRoutes = require('./apis/users/user.routes');
const eventRoutes = require('./apis/events/event.routes');
const categoryRoutes = require('./apis/categories/category.routes');
const settingRoutes = require('./apis/settings/setting.routes');
const dashboardRoutes = require('./apis/dashboard/dashboard.routes');
const pageRoutes = require('./apis/pages/page.routes');
const paymentRoutes = require('./apis/payments/payment.routes');
const inquiryRoutes = require('./apis/inquiries/inquiry.routes');
const faqRoutes = require('./apis/faqs/faq.routes');
const uploadRoutes = require('./apis/upload/upload.routes');
const adminViewRoutes = require('./apis/admin/adminView.routes');
const adminStripeRoutes = require('./apis/admin/stripe.routes');
const bookingRoutes = require('./apis/bookings/booking.routes');


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/admin', adminViewRoutes);
app.use('/api/v1/admin/stripe', adminStripeRoutes);
app.use('/api/bookings', bookingRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ GLOBAL ERROR:', err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
