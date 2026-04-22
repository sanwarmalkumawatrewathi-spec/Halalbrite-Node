const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, 
    socialLogin, 
    googleLogin, 
    facebookLogin, 
    appleLogin,
    updateProfile,
    becomeOrganizer,
    updatePreferences
} = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/social-login', socialLogin);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/apple', appleLogin);
router.get('/profile', protect, getProfile);
router.post('/update-profile', protect, updateProfile);
router.post('/become-organizer', protect, becomeOrganizer);

router.put('/preferences', protect, updatePreferences);

module.exports = router;
