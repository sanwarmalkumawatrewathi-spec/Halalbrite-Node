const express = require('express');
const router = express.Router();
const { 
    getEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    toggleSaveEvent,
    getSavedEvents,
    getEventLocations
} = require('../../controllers/event.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

router.get('/locations', getEventLocations);
router.get('/', getEvents);
router.get('/saved-events', protect, getSavedEvents);
router.get('/:id', getEventById);
router.post('/:id/save', protect, toggleSaveEvent);

// Protected routes for Organizers and Admins
router.post('/', protect, authorize('edit_events'), createEvent);
router.put('/:id', protect, authorize('edit_events'), updateEvent);
router.delete('/:id', protect, authorize('edit_events'), deleteEvent);

module.exports = router;
