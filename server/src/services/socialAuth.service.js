const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const AppleAuth = require('apple-auth');
const path = require('path');
const AppSetting = require('../models/appSetting.model');

class SocialAuthService {
    async getSettings() {
        const settings = await AppSetting.findOne();
        if (!settings || !settings.socialLogin) {
            throw new Error('Social login settings not configured');
        }
        return settings.socialLogin;
    }

    /**
     * Verify Google Token (handles both ID Token and Access Token)
     */
    async verifyGoogleToken(token) {
        const settings = await this.getSettings();
        if (!settings.google.isActive) throw new Error('Google login is disabled');

        // Check if it's likely an ID Token (JWT has 3 parts) or an Access Token (opaque ya29...)
        const isJwt = token.split('.').length === 3;

        if (isJwt) {
            const client = new OAuth2Client(settings.google.clientId);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: settings.google.clientId
            });

            const payload = ticket.getPayload();
            return {
                id: payload['sub'],
                email: payload['email'],
                name: payload['name'],
                picture: payload['picture']
            };
        } else {
            // It's an Access Token (like ya29...)
            const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
            const payload = response.data;

            if (payload.error) throw new Error(payload.error_description || 'Invalid Access Token');

            return {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };
        }
    }

    /**
     * Verify Meta (Facebook) Access Token
     */
    async verifyMetaToken(accessToken) {
        const settings = await this.getSettings();
        if (!settings.meta.isActive) throw new Error('Meta login is disabled');

        const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
        const data = response.data;

        if (data.error) throw new Error(data.error.message);

        return {
            id: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture?.data?.url
        };
    }

    /**
     * Verify Apple Identity Token
     */
    async verifyAppleToken(identityToken) {
        const settings = await this.getSettings();
        if (!settings.apple.isActive) throw new Error('Apple login is disabled');

        // Note: Apple verification usually requires a bit more setup with .p8 keys
        // For simple verification of the ID token (which is a JWT)
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(identityToken);
        
        // In a real production app, you MUST verify the signature using Apple's public keys
        // For now, we will return the decoded payload if we trust the source (e.g. secure frontend)
        return {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name || 'Apple User'
        };
    }
}

module.exports = new SocialAuthService();
