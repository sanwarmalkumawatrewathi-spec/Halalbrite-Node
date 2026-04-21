const stripeService = require('../services/stripe.service');
const AppSetting = require('../models/appSetting.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Event = require('../models/event.model');
const Transaction = require('../models/transaction.model');
const Payout = require('../models/payout.model');
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
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        res.redirect(`${frontendUrl}/organizer/dashboard?status=stripe_connected`);
    } catch (error) {
        console.error('❌ Stripe OAuth Error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        res.redirect(`${frontendUrl}/organizer/dashboard?status=error&message=${encodeURIComponent(error.message)}`);
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
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await handlePaymentIntentSucceeded(paymentIntent);
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
        const { eventId, ticketType, quantity, attendeeName, attendeeEmail, customerPhone, attendees } = req.body;

        // 1. Fetch Event & Validate
        const event = await Event.findById(eventId).populate('organizer');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.status !== 'published') return res.status(400).json({ message: 'Event is not active' });

        // 2. Fetch Selected Ticket
        const selectedTicket = event.ticketTypes.find(t => t.name === ticketType);
        if (!selectedTicket) return res.status(404).json({ message: 'Ticket type not found' });
        if (selectedTicket.quantity < quantity) return res.status(400).json({ message: 'Not enough tickets available' });

        // 3. Fetch System Settings (for Currency/API keys)
        const settings = await AppSetting.findOne();
        if (!settings) return res.status(500).json({ message: 'System settings not configured' });

        // 4. Financial Calculations based on Event.feePayment flag
        const subtotalBase = selectedTicket.price * quantity;
        const platformFeeBase = (selectedTicket.platformFee || 0) * quantity;
        const vatFeeBase = (selectedTicket.vatOnPlatformFee || 0) * quantity;
        const stripeFeeBase = selectedTicket.stripeProcessingFee || 0;
        const totalFeesBase = (selectedTicket.totalFees || 0) * quantity;

        // 5. Determine Currency & Rate (Fetch real-time from Stripe if needed)
        const stripeService = require('../services/stripe.service');
        await stripeService.ensureFreshRates(); // Refresh if older than 10 mins (I will update this in stripe service)
        
        // Refetch settings to get fresh rates
        const freshSettings = await AppSetting.findOne();
        
        const requestedCurrency = (req.body.currency || req.cookies.selected_currency || freshSettings.platform.currency || 'GBP').toUpperCase();
        const baseCurrency = (freshSettings.platform.currency || 'GBP').toUpperCase();
        
        let exchangeRate = 1;
        let symbol = '£';

        if (requestedCurrency !== baseCurrency) {
            const currencyData = settings.currencies.find(c => c.code === requestedCurrency && c.isActive);
            if (currencyData) {
                exchangeRate = currencyData.rate;
                symbol = currencyData.symbol;
            } else {
                // Fallback if requested currency is not found or inactive
                console.warn(`⚠️ Requested currency ${requestedCurrency} not found/active, falling back to ${baseCurrency}`);
            }
        } else {
            const baseCurrencyData = settings.currencies.find(c => c.code === baseCurrency);
            if (baseCurrencyData) symbol = baseCurrencyData.symbol;
        }

        // 6. Convert to Target Currency
        const finalTotalBase = event.feePayment === true ? subtotalBase : subtotalBase + totalFeesBase;
        const organizerEarningsBase = event.feePayment === true ? subtotalBase - totalFeesBase : subtotalBase;

        const finalTotal = parseFloat((finalTotalBase * exchangeRate).toFixed(2));
        const organizerEarnings = parseFloat((organizerEarningsBase * exchangeRate).toFixed(2));
        const platformFee = parseFloat((platformFeeBase * exchangeRate).toFixed(2));
        const vatFee = parseFloat((vatFeeBase * exchangeRate).toFixed(2));
        const stripeFee = parseFloat((stripeFeeBase * exchangeRate).toFixed(2));

        // 7. Create Preliminary Booking (Pending)
        const booking = await Booking.create({
            booking_reference: generateBookingReference(),
            user_id: req.user._id,
            organizer_id: event.organizer,
            event_id: eventId,
            event_name: event.title,
            event_date: event.startDate,
            event_time: event.startTime,
            event_venue: event.location?.venueName || '',
            event_location: event.location?.address || '',
            ticket_name: selectedTicket.name,
            quantity,
            customer_name: attendeeName || req.user.username,
            customer_email: attendeeEmail || req.user.email,
            customer_phone: customerPhone,
            attendee_names: attendees || [attendeeName || req.user.username],
            
            amount_total: finalTotal,
            base_amount_total: finalTotalBase,
            organizer_amount: organizerEarnings,
            platform_fee: platformFee + vatFee, // Store combined platform fee
            exchange_rate: exchangeRate,
            currency: requestedCurrency,
            base_currency: baseCurrency,
            payment_status: 'pending'
        });

        // 8. Stripe Payment Intent
        const stripeInstance = await stripeService.getStripeInstance();

        const paymentData = {
            amount: Math.round(finalTotal * 100), // convert to cents
            currency: requestedCurrency.toLowerCase(),
            metadata: {
                bookingId: booking._id.toString(),
                bookingReference: booking.booking_reference,
                eventId: eventId.toString(),
                attendeeEmail: attendeeEmail || req.user.email,
                exchangeRate: exchangeRate.toString(),
                baseAmount: finalTotalBase.toFixed(2),
                baseCurrency: baseCurrency
            }
        };

        const paymentIntent = await stripeInstance.paymentIntents.create(paymentData);

        // 7. Update booking with Intent ID
        booking.stripePaymentIntentId = paymentIntent.id;
        await booking.save();

        res.status(201).json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                bookingId: booking._id,
                breakdown: {
                    subtotal: subtotal.toFixed(2),
                    platformFee: platformFee.toFixed(2),
                    vatFee: vatFee.toFixed(2),
                    stripeFee: stripeFee.toFixed(2),
                    total: finalTotal.toFixed(2),
                    currency: settings.platform.currency || 'GBP'
                }
            }
        });

    } catch (error) {
        console.error('❌ Checkout API Error:', error);
        res.status(500).json({ message: error.message });
    }
};
