const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile, 
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    getMyTickets, 
    getSavedItems,
    toggleSaveEvent,
    toggleFollowOrganizer,
    updateUserPreferences,
    upgradeToOrganizer,
    getOrganizerStats,
    getOrganizerEvents,
    getOrganizerCustomers,
    getOrganizerPayouts,
    getOrganisations,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation
} = require('../../controllers/dashboard.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// User/Attendee Panel Routes
router.get('/user/profile', protect, getUserProfile);
router.put('/user/profile', protect, updateUserProfile);

router.get('/user/addresses', protect, getUserAddresses);
router.post('/user/addresses', protect, addUserAddress);
router.put('/user/addresses/:id', protect, updateUserAddress);
router.delete('/user/addresses/:id', protect, deleteUserAddress);
router.patch('/user/addresses/:id/default', protect, setDefaultAddress);

router.get('/user/tickets', protect, getMyTickets);
router.get('/user/saved', protect, getSavedItems);
router.post('/user/save-event/:id', protect, toggleSaveEvent);
router.post('/user/follow-organizer/:id', protect, toggleFollowOrganizer);

router.put('/user/preferences', protect, updateUserPreferences);
router.post('/user/upgrade', protect, upgradeToOrganizer);

// Organizer Routes
router.get('/organizer/stats', protect, authorize('publish_events'), getOrganizerStats);
router.get('/organizer/events', protect, authorize('publish_events'), getOrganizerEvents);
router.get('/organizer/customers', protect, authorize('publish_events'), getOrganizerCustomers);
router.get('/organizer/payouts', protect, authorize('publish_events'), getOrganizerPayouts);

router.get('/organizer/organisations', protect, authorize('publish_events'), getOrganisations);
router.post('/organizer/organisations', protect, authorize('publish_events'), createOrganisation);
router.put('/organizer/organisations/:id', protect, authorize('publish_events'), updateOrganisation);
router.delete('/organizer/organisations/:id', protect, authorize('publish_events'), deleteOrganisation);

module.exports = router;
