const express = require('express');
const router = express.Router();
const { 
    getOrganizerProfile, 
    getOrganizerEvents, 
    toggleFollow,
    contactOrganizer
} = require('../controllers/organizer.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/:id', getOrganizerProfile);
router.get('/:id/events', getOrganizerEvents);
router.post('/:id/follow', protect, toggleFollow);
router.post('/:id/contact', contactOrganizer);

module.exports = router;
