const stripeService = require('../services/stripe.service');
const AppSetting = require('../models/appSetting.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Event = require('../models/event.model');
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
        const url = await stripeService.getConnectUrl(req.user);
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
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/OrganiserDashboard?status=stripe_connected`);
    } catch (error) {
        console.error('❌ Stripe OAuth Error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/OrganiserDashboard?status=error&message=${encodeURIComponent(error.message)}`);
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

        res.json({ success: true, data: result });
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
            // Handle account update (verification status change)
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

    // 3. Update Event context (attendees and capacity)
    await Event.findByIdAndUpdate(booking.event_id._id, {
        $push: { attendees: booking.user_id },
        $inc: { capacity: -booking.quantity }
    });

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
            eventId, ticketType, quantity,
            attendeeName, attendeeEmail, customerPhone,
            addressLine1, addressLine2, city, postcode, country,
            isGuest
        } = req.body;

        // 1. Fetch Event & Validate
        const event = await Event.findById(eventId).populate('organizer');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.status !== 'published') return res.status(400).json({ message: 'Event is not active' });

        // 2. Fetch Selected Ticket
        const selectedTicket = event.ticketTypes.find(t => t.name === ticketType);
        if (!selectedTicket) return res.status(404).json({ message: 'Ticket type not found' });
        if (selectedTicket.quantity < quantity) return res.status(400).json({ message: 'Not enough tickets available' });

        // 3. Fetch System Settings
        const settings = await AppSetting.findOne();
        if (!settings) return res.status(500).json({ message: 'System settings not configured' });

        // 4. Financial Calculations
        const subtotal = selectedTicket.price * quantity;

        // Calculate fees fresh to ensure they match frontend and latest settings
        const feePercentage = settings.platform.feePercentage || 0;
        const fixedFee = settings.platform.fixedFee || 0;
        const vatRate = settings.platform.vatRate || 0;
        const stripePercentage = settings.platform.stripeFeePercentage || 3;
        const fixedStripe = settings.platform.fixedStripeFee || 0.3;

        const platformUnit = selectedTicket.price * (feePercentage / 100) + fixedFee;
        const vatUnit = platformUnit * (vatRate / 100);
        const stripeUnit = selectedTicket.price * (stripePercentage / 100) + fixedStripe;
        const totalFeesBase = (platformUnit + vatUnit + stripeUnit) * quantity;

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

        // 6. Convert
        const finalTotalBase = event.feePayment === true ? subtotal : subtotal + totalFeesBase;
        const organizerEarningsBase = event.feePayment === true ? subtotal - totalFeesBase : subtotal;

        const platformFeeBase = platformUnit * quantity;
        const vatFeeBase = vatUnit * quantity;

        const finalTotal = parseFloat((finalTotalBase * exchangeRate).toFixed(2));
        const organizerEarnings = parseFloat((organizerEarningsBase * exchangeRate).toFixed(2));
        const platformFee = parseFloat((platformFeeBase * exchangeRate).toFixed(2));
        const vatFee = parseFloat((vatFeeBase * exchangeRate).toFixed(2));

        const stripeFeeBase = (finalTotalBase * (freshSettings.platform.stripeFeePercentage / 100)) + freshSettings.platform.fixedStripeFee;
        const stripeFee = parseFloat((stripeFeeBase * exchangeRate).toFixed(2));

        // 7. Booking
        const booking = await Booking.create({
            booking_reference: generateBookingReference(),
            user_id: isGuest ? null : req.user._id,
            is_guest: !!isGuest,
            organizer_id: event.organizer,
            event_id: eventId,
            event_name: event.title,
            event_date: event.startDate,
            event_time: event.startTime,
            event_venue: event.location?.venueName || '',
            event_location: event.location?.address || '',
            ticket_name: selectedTicket.name,
            quantity,
            customer_name: attendeeName || (req.user ? req.user.username : 'Guest'),
            customer_email: attendeeEmail || (req.user ? req.user.email : ''),
            customer_phone: customerPhone,
            attendee_names: [attendeeName || (req.user ? req.user.username : 'Guest')],
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
                    url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?bookingId=${booking._id}`,
                    bookingId: booking._id,
                    isFree: true
                }
            });
        }

        // 9. Stripe Session
        const unitPriceIncludingFees = parseFloat((finalTotal / quantity).toFixed(2));

        const session = await stripeService.createCheckoutSession({
            bookingId: booking._id.toString(),
            eventId: eventId.toString(),
            ticketName: selectedTicket.name,
            eventName: event.title,
            amount: unitPriceIncludingFees, 
            quantity: quantity,
            currency: requestedCurrency,
            customerEmail: attendeeEmail || (req.user ? req.user.email : ''),
            eventBanner: event.banner ? (event.banner.startsWith('http') ? event.banner : `${process.env.BACKEND_URL || 'http://localhost:5000'}${event.banner}`) : null
        });

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
async function handleTicketDelivery(booking) {
    console.log(`📦 Generating PDF and Sending Email for Booking: ${booking.booking_reference}`);
    
    try {
        const pdfBuffer = await pdfService.generateTicketPdf(booking);
        
        // 1. Send Tickets to Customer
        await emailService.sendTicketEmail(booking, pdfBuffer);
        
        // 2. Fetch Organizer and Platform info for notifications
        const [event, settings] = await Promise.all([
            Event.findById(booking.event_id).populate('organizer'),
            AppSetting.findOne()
        ]);

        const organizerEmail = event?.organizer?.email;
        const platformEmail = settings?.contactInfo?.contactEmail || settings?.smtp?.fromEmail;

        // 3. Notify Organizer
        if (organizerEmail) {
            await emailService.sendNotificationEmail(
                organizerEmail,
                `New Ticket Booking: ${booking.event_name}`,
                'New Ticket Sold!',
                `Congratulations! A new ticket has been sold for your event "${booking.event_name}".`,
                booking
            );
        }

        // 4. Notify Platform Admin
        if (platformEmail) {
            await emailService.sendNotificationEmail(
                platformEmail,
                `New Platform Booking: ${booking.booking_reference}`,
                'New Booking on HalalBrite',
                `A new booking has been completed on the platform for "${booking.event_name}".`,
                booking
            );
        }

        console.log(`✅ Ticket Delivery & Notifications Complete for ${booking.booking_reference}`);
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
