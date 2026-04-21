const AppSetting = require('../models/appSetting.model');

/**
 * Middleware to detect currency from URL prefix or cookies.
 * Also provides a global formatPrice helper for EJS views.
 */
const currencyMiddleware = async (req, res, next) => {
    try {
        // Skip for static files or common assets
        if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf)$/) || req.path.startsWith('/api/')) {
            return next();
        }

        const settings = await AppSetting.findOne();
        
        // Provide default formatPrice early to avoid ReferenceError if sync fails
        res.locals.formatPrice = (amount) => {
            if (amount === undefined || amount === null) return '';
            if (amount === 0) return 'Free';
            return `£${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };

        if (!settings) return next();

        // Auto-sync rates if stale (every 1 hour)
        const stripeService = require('../services/stripe.service');
        await stripeService.ensureFreshRates();

        const currencies = settings.currencies || [];
        const baseCurrencyCode = settings.platform?.currency || 'GBP';
        
        const countryCodes = ['uk', 'us', 'au', 'ie'];
        const countryToCurrency = {
            'uk': 'GBP',
            'us': 'USD',
            'au': 'AUD',
            'ie': 'EUR'
        };

        // 1. Detect from URL prefix
        const pathParts = req.path.split('/').filter(p => p);
        const firstPart = pathParts[0]?.toLowerCase();
        
        let detectedCurrency = null;

        if (countryCodes.includes(firstPart)) {
            const targetCode = countryToCurrency[firstPart];
            detectedCurrency = currencies.find(c => c.code === targetCode && c.isActive);
            
            // Important: We don't rewrite req.url here if we want the country code to stay in the URL
            // However, the user said "Without URL Change" for the switcher, but "country-specific URLs" for the landing.
            // If they want /uk/events to work, we must either have routes for it or rewrite.
            // Let's rewrite so existing routes work without modification.
            req.url = '/' + pathParts.slice(1).join('/');
            if (req.url === '//') req.url = '/';
        }

        // 2. Detect from Cookie (Manual Override)
        if (!detectedCurrency && req.cookies.selected_currency) {
            detectedCurrency = currencies.find(c => c.code === req.cookies.selected_currency && c.isActive);
        }

        // 3. Fallback to Default
        if (!detectedCurrency) {
            detectedCurrency = currencies.find(c => c.code === baseCurrencyCode) || {
                code: 'GBP',
                symbol: '£',
                rate: 1,
                isActive: true
            };
        }

        // Set variables for views
        res.locals.currentCurrency = detectedCurrency;
        res.locals.allCurrencies = currencies.filter(c => c.isActive);

        // Update Global Helper with detected currency settings
        res.locals.formatPrice = (amount) => {
            if (amount === undefined || amount === null) return '';
            if (amount === 0) return 'Free';
            
            const rate = detectedCurrency.rate || 1;
            const converted = amount * rate;
            
            return `${detectedCurrency.symbol}${converted.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };

        next();
    } catch (err) {
        console.error('❌ Currency Middleware Error:', err);
        next();
    }
};

module.exports = currencyMiddleware;
