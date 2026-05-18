const stripeService = require('../services/stripe.service');
const AppSetting = require('../models/appSetting.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Role = require('../models/role.model');
const Transaction = require('../models/transaction.model');
const Payout = require('../models/payout.model');
const pdfService = require('../services/pdf.service');
const emailService = require('../services/email.service');
const crypto = require('crypto');

// Helper: Generate Booking Reference (e.g., HB-525F22C0)
const generateBookingReference = () => {
    return `HB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// @desc    Redirect to Stripe for Organizer Connect (OAuth)
// @route   GET /api/payments/connect
// @access  Private/Organizer
exports.connectStripe = async (req, res) => {
    try {
        const origin = req.get('origin');
        const url = await stripeService.getConnectUrl(req.user, origin);
        res.json({ message: 'Stripe Connect Onboarding URL generated', url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Stripe Connect Status
// @route   GET /api/payments/connect/status
// @access  Private/Organizer
exports.getConnectStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            isConnected: !!user.stripeConnectedId,
            stripeConnectedId: user.stripeConnectedId || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Disconnect Stripe Account
// @route   POST /api/payments/connect/disconnect
// @access  Private/Organizer
exports.disconnectStripe = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $unset: { stripeConnectedId: 1 } });
        res.json({ success: true, message: 'Stripe account disconnected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe OAuth Callback
// @route   GET /api/payments/callback
// @access  Public
exports.stripeCallback = async (req, res) => {
    const { code, state } = req.query; // state is userId

    try {
        const stripeConnectedId = await stripeService.handleOAuthCallback(code);

        // Update user
        await User.findByIdAndUpdate(state, { stripeConnectedId });

        // Redirect to dashboard (assuming Next.js path)
        const origin = req.get('origin');
        const frontendUrl = origin || process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/organizer-dashboard?status=stripe_connected`);
    } catch (error) {
        console.error('❌ Stripe OAuth Error:', error);
        const origin = req.get('origin');
        const frontendUrl = origin || process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/organizer-dashboard?status=error&message=${encodeURIComponent(error.message)}`);
    }
};

// @desc    Get Organizer Stats (Revenue, Tickets Sold, etc.)
// @route   GET /api/payments/organizer/stats
// @access  Private/Organizer
exports.getOrganizerStats = async (req, res) => {
    try {
        const organizerId = req.user._id;

        const stats = await Transaction.aggregate([
            { $match: { organizer_id: organizerId, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$base_amount' },
                    organizerEarnings: { $sum: { $multiply: ['$organizer_amount', { $divide: [1, '$exchange_rate'] }] } }, // Estimate in base currency
                    platformFees: { $sum: '$platform_fee' },
                    ticketCount: { $sum: 1 }
                }
            }
        ]);

        const result = stats[0] || { totalRevenue: 0, organizerEarnings: 0, platformFees: 0, ticketCount: 0 };

        // Include stripe status
        let user = await User.findById(organizerId);

        // Auto-sync if connected but not fully enabled (to ensure dashboard is fresh)
        if (user.stripeConnectedId && (!user.charges_enabled || !user.payouts_enabled)) {
            console.log(`🔄 Auto-syncing Stripe for ${user.email} during stats fetch...`);
            await stripeService.syncUserStripeStatus(user._id);
            user = await User.findById(organizerId); // Reload
        }

        res.json({
            success: true,
            data: {
                ...result,
                stripeConnected: !!user.stripeConnectedId,
                chargesEnabled: user.charges_enabled,
                payoutsEnabled: user.payouts_enabled,
                verificationStatus: user.verification_status,
                requirements: user.requirements || []
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Organizer Balance from Stripe
// @route   GET /api/payments/organizer/balance
// @access  Private/Organizer
exports.getOrganizerBalance = async (req, res) => {
    try {
        if (!req.user.stripeConnectedId) {
            return res.status(400).json({ message: 'Stripe account not connected' });
        }

        const balance = await stripeService.getAccountBalance(req.user.stripeConnectedId);
        res.json({ success: true, data: balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Stripe Login Link for Express Dashboard
// @route   GET /api/payments/connect/login-link
// @access  Private/Organizer
exports.createLoginLink = async (req, res) => {
    try {
        if (!req.user.stripeConnectedId) {
            return res.status(400).json({ message: 'Stripe account not connected' });
        }

        const loginLink = await stripeService.createLoginLink(req.user.stripeConnectedId);
        res.json({ success: true, url: loginLink.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Organizer Transaction History
// @route   GET /api/payments/organizer/transactions
// @access  Private/Organizer
exports.getOrganizerTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ organizerId: req.user._id })
            .populate('eventId', 'title')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify and Sync Stripe Connect Status
// @route   POST /api/payments/connect/verify
// @access  Private/Organizer
exports.verifyConnectStatus = async (req, res) => {
    try {
        console.log(`🔍 Verifying Stripe status for user: ${req.user.email}`);
        const user = await stripeService.syncUserStripeStatus(req.user._id);

        if (!user) {
            console.log(`❌ No Stripe account found for user: ${req.user.email}`);
            return res.status(400).json({ success: false, message: 'Stripe account not connected' });
        }

        console.log(`✅ User ${user.email} Sync Result: 
            stripeConnectedId: ${user.stripeConnectedId}
            verificationStatus: ${user.verification_status}
            chargesEnabled: ${user.charges_enabled}
            payoutsEnabled: ${user.payouts_enabled}`);

        res.json({
            success: true,
            isConnected: !!user.stripeConnectedId,
            verificationStatus: user.verification_status,
            chargesEnabled: user.charges_enabled,
            payoutsEnabled: user.payouts_enabled
        });
    } catch (error) {
        console.error(`❌ Stripe Verify Error for ${req.user.email}:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/payments/webhook
// @access  Public (Stripe Signature Verified)
exports.handleWebhook = async (req, res) => {
    let event;

    try {
        const signature = req.headers['stripe-signature'];
        event = await stripeService.constructEvent(req.body, signature);
    } catch (err) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleCheckoutSessionCompleted(session);
            break;
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Only process if not already processed by session
            if (!paymentIntent.metadata.processedBySession) {
                await handlePaymentIntentSucceeded(paymentIntent);
            }
            break;
        case 'account.updated':
            const account = event.data.object;
            const user = await User.findOne({ stripeConnectedId: account.id });
            if (user) {
                await stripeService.syncUserStripeStatus(user._id);
                console.log(`✅ Webhook: Synced Stripe status for ${user.email}`);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

// Helper: Process successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    if (!bookingId) return;

    const booking = await Booking.findById(bookingId).populate('event_id');
    if (!booking) return;

    // 1. Update Booking status
    booking.payment_status = 'paid';
    booking.stripe_payment_intent_id = paymentIntent.id;
    booking.stripe_charge_id = paymentIntent.latest_charge || paymentIntent.id;
    await booking.save();

    // Trigger Ticket Delivery (PDF + Email)
    try {
        await handleTicketDelivery(booking);
    } catch (deliveryErr) {
        console.error(`❌ Delivery Failed for Booking ${booking.booking_reference}:`, deliveryErr);
    }

    // 2. Handle Separate Transfer to Organizer (Replica of legacy logic)
    let stripeTransferId = null;
    if (booking.organizer_amount > 0) {
        // Correctly access organizer from populated event
        const organizerId = booking.event?.organizer || booking.organizer_id;
        const organizer = await User.findById(organizerId);
        const destinationAccountId = organizer?.stripeConnectedId || organizer?.stripe_account_id;

        if (organizer && destinationAccountId) {
            try {
                const stripeInstance = await stripeService.getStripeInstance();
                const transfer = await stripeInstance.transfers.create({
                    amount: Math.round(booking.organizer_amount * 100),
                    currency: paymentIntent.currency,
                    destination: destinationAccountId,
                    source_transaction: booking.stripe_charge_id,
                    description: `Transfer for Booking ${booking.booking_reference}`,
                    metadata: {
                        bookingId: booking._id.toString(),
                        bookingReference: booking.booking_reference,
                        eventId: booking.event_id._id.toString()
                    }
                });
                stripeTransferId = transfer.id;
            } catch (transferErr) {
                console.error(`❌ Stripe Transfer Failed: ${transferErr.message}`);
            }
        }
    }

    // 3. Update Event context (attendees, capacity and individual ticket stock)
    const eventUpdate = {
        $push: { attendees: booking.user_id },
        $inc: { capacity: -booking.quantity }
    };

    // Deduct stock for each ticket type in the booking
    if (booking.items && booking.items.length > 0) {
        for (const item of booking.items) {
            await Event.updateOne(
                { _id: booking.event_id._id, "ticketTypes.name": item.ticket_name },
                { $inc: { "ticketTypes.$.quantity": -item.quantity } }
            );
        }
    }

    await Event.findByIdAndUpdate(booking.event_id._id, eventUpdate);

    // 4. Create Transaction Record (Split Ledger)
    await Transaction.create({
        order_id: booking._id,
        organizer_id: booking.event_id.organizer,
        event_id: booking.event_id._id,
        amount: booking.amount_total,
        platform_fee: booking.platform_fee,
        organizer_amount: booking.organizer_amount,
        currency: booking.currency.toUpperCase(),
        exchange_rate: booking.exchange_rate,
        base_amount: booking.base_amount_total,
        status: 'completed',
        stripe_payment_intent_id: paymentIntent.id,
        stripe_charge_id: booking.stripe_charge_id,
        stripe_transfer_id: stripeTransferId,
        type: 'sale',
        description: `${booking.quantity} × ${booking.ticket_name} for ${booking.event_name} (${booking.currency})`
    });

    console.log(`✅ Checkout Success: Booking ${booking.booking_reference} finalized in ${booking.currency}.`);
}

/**
 * @desc    Initialize Checkout / Create Order
 * @route   POST /api/v1/payments/create-intent
 * @access  Private
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        const {
            eventId, items, // items: [{ name: string, qty: number }]
            attendeeName, attendeeEmail, customerPhone,
            addressLine1, addressLine2, city, postcode, country,
            isGuest
        } = req.body;

        const ticketItems = items || [];
        if (ticketItems.length === 0 && req.body.ticketType) {
            ticketItems.push({ name: req.body.ticketType, qty: req.body.quantity });
        }

        // 1. Fetch Event & Validate
        const event = await Event.findById(eventId).populate('organizer');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.status !== 'published') return res.status(400).json({ message: 'Event is not active' });


        // 3. Fetch System Settings
        const settings = await AppSetting.findOne();
        if (!settings) return res.status(500).json({ message: 'System settings not configured' });

        // 3. Financial Calculations
        let totalSubtotalBase = 0;
        let totalPlatformFeeBase = 0;
        let totalVatFeeBase = 0;
        let totalStripeFeeBase = 0;
        let totalQuantity = 0;
        const bookingItems = [];
        const stripeLineItems = [];


        const feePercentage = settings?.platform?.feePercentage || 0;
        const fixedFee = settings?.platform?.fixedFee || 0;
        const vatRate = settings?.platform?.vatRate || 0;
        const stripePercentage = settings?.platform?.stripeFeePercentage || 3;
        const fixedStripe = settings?.platform?.fixedStripeFee || 0.3;

        for (const item of ticketItems) {
            const ticket = event.ticketTypes.find(t => t.name === item.name);
            if (!ticket) continue;
            if (ticket.quantity < item.qty) return res.status(400).json({ message: `Not enough tickets available for ${item.name}` });

            const itemSubtotal = ticket.price * item.qty;
            const platformUnit = ticket.price === 0 ? 0 : (ticket.price * (feePercentage / 100) + fixedFee);
            const vatUnit = ticket.price === 0 ? 0 : (platformUnit * (vatRate / 100));
            const stripeUnit = ticket.price === 0 ? 0 : (ticket.price * (stripePercentage / 100) + fixedStripe);

            const itemFeesBase = platformUnit + vatUnit + stripeUnit;
            const itemTotalBase = event.feePayment === true ? ticket.price : ticket.price + itemFeesBase;

            totalSubtotalBase += itemSubtotal;
            totalPlatformFeeBase += platformUnit * item.qty;
            totalVatFeeBase += vatUnit * item.qty;
            totalQuantity += item.qty;

            bookingItems.push({
                ticket_id: ticket._id,
                ticket_name: ticket.name,
                quantity: item.qty,
                price: ticket.price,
                fees: itemFeesBase,
                total: itemTotalBase
            });
        }

        if (bookingItems.length === 0) return res.status(400).json({ message: 'No valid tickets selected' });

        // 5. Currency & Rates
        await stripeService.ensureFreshRates();
        const freshSettings = await AppSetting.findOne();
        const requestedCurrency = (req.body.currency || req.cookies.selected_currency || freshSettings.platform.currency || 'EUR').toUpperCase();
        const baseCurrency = (freshSettings.platform.currency || 'EUR').toUpperCase();

        let exchangeRate = 1;
        if (requestedCurrency !== baseCurrency) {
            const currencyData = freshSettings.currencies.find(c => c.code === requestedCurrency && c.isActive);
            if (currencyData) exchangeRate = currencyData.rate;
        }

        const totalFeesBase = totalSubtotalBase === 0 ? 0 : (totalPlatformFeeBase + totalVatFeeBase + (totalSubtotalBase * (stripePercentage / 100) + fixedStripe * totalQuantity));
        const finalTotalBase = totalSubtotalBase === 0 ? 0 : (event.feePayment === true ? totalSubtotalBase : totalSubtotalBase + totalPlatformFeeBase + totalVatFeeBase + (totalSubtotalBase * (stripePercentage / 100) + fixedStripe * totalQuantity));
        const organizerEarningsBase = totalSubtotalBase === 0 ? 0 : (event.feePayment === true ? totalSubtotalBase - totalFeesBase : totalSubtotalBase);

        const finalTotal = parseFloat((finalTotalBase * exchangeRate).toFixed(2));
        const organizerEarnings = parseFloat((organizerEarningsBase * exchangeRate).toFixed(2));
        const platformFee = parseFloat((totalPlatformFeeBase * exchangeRate).toFixed(2));
        const vatFee = parseFloat((totalVatFeeBase * exchangeRate).toFixed(2));
        const stripeFee = parseFloat(((finalTotalBase - totalSubtotalBase - totalPlatformFeeBase - totalVatFeeBase) * exchangeRate).toFixed(2));

        // 7. Booking
        const booking = await Booking.create({
            booking_reference: generateBookingReference(),
            user_id: isGuest ? null : req.user._id,
            is_guest: !!isGuest,
            organizer_id: event.organizer,
            event_id: eventId,
            event_name: event.title,
            event_date: event.startDate,
            event_time: event.startTime ? (event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime) : "TBA",
            event_venue: event.location?.venueName || event.title || "Venue TBA",
            event_location: event.location?.address || event.location?.city || event.location?.country || "Location TBA",
            items: bookingItems,
            ticket_name: bookingItems.map(i => `${i.quantity}x ${i.ticket_name}`).join(', '),
            quantity: totalQuantity,
            customer_name: attendeeName || (req.user ? req.user.username : 'Guest'),
            customer_email: attendeeEmail || (req.user ? req.user.email : ''),
            customer_phone: customerPhone,
            attendee_names: req.body.attendees || [attendeeName || (req.user ? req.user.username : 'Guest')],
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            postcode: postcode,
            country: country || 'United Kingdom',
            amount_total: finalTotal,
            base_amount_total: finalTotalBase,
            organizer_amount: organizerEarnings,
            platform_fee: platformFee,
            stripe_fee: stripeFee,
            exchange_rate: exchangeRate,
            currency: requestedCurrency,
            base_currency: baseCurrency,
            payment_status: 'pending'
        });

        // 8. Free Tickets
        if (finalTotal === 0) {
            booking.payment_status = 'paid';
            await booking.save();

            // Trigger Delivery for Free Tickets
            try {
                await handleTicketDelivery(booking);
            } catch (err) { console.error('Free Delivery Error:', err); }

            return res.status(201).json({
                success: true,
                message: 'Free ticket booked successfully',
                data: {
                    url: `${req.get('origin') || process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?bookingId=${booking._id}`,
                    bookingId: booking._id,
                    isFree: true
                }
            });
        }

        // 9. Stripe Session
        const lineItems = bookingItems.map(item => ({
            price_data: {
                currency: requestedCurrency.toLowerCase(),
                product_data: {
                    name: item.ticket_name,
                    description: `${event.title} - ${item.ticket_name}`,
                    images: event.banner ? [event.banner.startsWith('http') ? event.banner : `${process.env.BACKEND_URL || 'http://localhost:5000'}${event.banner}`] : []
                },
                unit_amount: Math.round((item.total * exchangeRate) * 100)
            },
            quantity: item.quantity
        }));

        const session = await stripeService.createCheckoutSessionMulti({
            bookingId: booking._id.toString(),
            eventId: eventId.toString(),
            eventName: event.title,
            lineItems: lineItems,
            customerEmail: attendeeEmail || (req.user ? req.user.email : '')
        }, req.get('origin'));

        booking.stripe_session_id = session.id;
        await booking.save();

        res.status(201).json({
            success: true,
            data: {
                url: session.url,
                bookingId: booking._id
            }
        });
    } catch (error) {
        console.error('❌ Checkout API Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Helper: Process Ticket Delivery (PDF + Email)
exports.handleTicketDelivery = async function (booking) {
    console.log(`📦 Processing delivery for booking: ${booking.booking_reference}`);

    try {
        // 1. Deduct Inventory (IMPORTANT: Do this first or ensure it happens)
        const event = await Event.findById(booking.event_id);
        if (event) {
            for (const item of booking.items) {
                // Find the specific ticket type and decrement quantity
                await Event.updateOne(
                    { _id: event._id, "ticketTypes._id": item.ticket_id },
                    { $inc: { "ticketTypes.$.quantity": -item.quantity } }
                );
                console.log(`📉 Deducted ${item.quantity} from ticket: ${item.ticket_name}`);
            }
        }

        // 2. Generate PDF
        const pdfBuffer = await pdfService.generateTicketPdf(booking);

        // 3. Send Tickets to Customer (Attendee)
        await emailService.sendTicketEmail(booking, pdfBuffer, booking.customer_email, 'attendee');

        // 4. Send Notification to Organizer
        const organizer = await User.findById(booking.organizer_id);
        if (organizer && organizer.email) {
            await emailService.sendSaleNotificationEmail(booking, organizer.email, 'organizer');
        }

        // 5. Send Notification to Platform Admin
        const adminRole = await Role.findOne({ $or: [{ slug: 'administrator' }, { slug: 'admin' }] });
        const adminUser = adminRole ? await User.findOne({ roles: adminRole._id }) : null;
        const adminEmail = adminUser?.email || process.env.ADMIN_EMAIL;

        console.log(`📧 Sending Sale Notification Emails - Organizer: ${organizer?.email}, Admin: ${adminEmail}`);

        if (adminEmail) {
            await emailService.sendSaleNotificationEmail(booking, adminEmail, 'admin');
        }

        console.log(`✅ Ticket Delivery & Inventory Update Complete for ${booking.booking_reference}`);
    } catch (error) {
        console.error('❌ Ticket Delivery Error:', error);
    }
}

// Helper: Handle Checkout Session Completion
async function handleCheckoutSessionCompleted(session) {
    const bookingId = session.metadata.bookingId;
    if (!bookingId) return;

    const stripeInstance = await stripeService.getStripeInstance();
    const paymentIntentId = session.payment_intent;

    if (paymentIntentId) {
        const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
        // Mark as processed by session to avoid double processing in handleWebhook
        paymentIntent.metadata = { ...paymentIntent.metadata, bookingId: bookingId, processedBySession: 'true' };
        await handlePaymentIntentSucceeded(paymentIntent);
    }
}


// @desc    Download Ticket PDF
// @route   GET /api/payments/booking/:id/download
exports.downloadTicket = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const pdfBuffer = await pdfService.generateTicketPdf(booking);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Ticket-${booking.booking_reference}.pdf`,
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend Ticket Email
// @route   POST /api/payments/booking/:id/resend-email
exports.resendTicketEmail = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const pdfBuffer = await pdfService.generateTicketPdf(booking);
        await emailService.sendTicketEmail(booking, pdfBuffer);

        res.json({ success: true, message: 'Email resent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// @desc    Verify Payment Status (Fallback for Webhooks)
// @route   POST /api/payments/booking/:id/verify
exports.verifyBookingPayment = async (req, res) => {
    console.log(`🔍 Verifying payment for booking: ${req.params.id}`);
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log("❌ Booking not found");
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If already paid, just return success
        if (booking.payment_status === 'paid') {
            console.log("✅ Booking already marked as paid");
            return res.json({ success: true, status: 'paid' });
        }

        // If it's a paid booking and has a session ID
        if (booking.amount_total > 0 && booking.stripe_session_id) {
            console.log(`📡 Checking Stripe Session: ${booking.stripe_session_id}`);
            const stripeInstance = await stripeService.getStripeInstance();
            const session = await stripeInstance.checkout.sessions.retrieve(booking.stripe_session_id);

            console.log(`💳 Stripe Session Status: ${session.payment_status}`);
            if (session.payment_status === 'paid') {
                // Finalize Booking
                booking.payment_status = 'paid';
                booking.stripe_payment_intent_id = session.payment_intent;
                await booking.save();

                // Trigger Delivery (Deducts inventory and sends emails)
                await exports.handleTicketDelivery(booking);

                console.log("✅ Booking finalized via fallback verification");
                return res.json({ success: true, status: 'paid' });
            }
        }

        console.log(`⚠️ Booking remains ${booking.payment_status}`);
        res.json({ success: false, status: booking.payment_status });
    } catch (error) {
        console.error('❌ Verify Payment Error:', error);
        res.status(500).json({ message: error.message });
    }
}
// Helper: Batch verify bookings
exports.verifyPendingBookings = async function (bookings) {
    const pending = bookings.filter(b => b.payment_status === 'pending' && b.stripe_session_id);
    if (pending.length === 0) return;

    console.log(`🔍 Auto-verifying ${pending.length} pending bookings...`);
    const stripeInstance = await stripeService.getStripeInstance();

    for (const booking of pending) {
        try {
            const session = await stripeInstance.checkout.sessions.retrieve(booking.stripe_session_id);
            if (session.payment_status === 'paid') {
                booking.payment_status = 'paid';
                booking.stripe_payment_intent_id = session.payment_intent;
                await booking.save();
                await exports.handleTicketDelivery(booking);
                console.log(`✅ Auto-finalized booking: ${booking.booking_reference}`);
            }
        } catch (err) {
            console.error(`Failed to auto-verify booking ${booking._id}:`, err.message);
        }
    }
}
