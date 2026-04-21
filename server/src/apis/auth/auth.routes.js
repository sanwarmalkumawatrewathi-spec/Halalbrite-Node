const express = require('express');
const router = express.Router();
const { register, login, getProfile, socialLogin, googleLogin, facebookLogin, appleLogin } = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/social-login', socialLogin); // Keeping for backward compatibility
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/apple', appleLogin);
router.get('/profile', protect, getProfile);

module.exports = router;
