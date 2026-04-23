const express = require('express');
const router = express.Router();
const { getMyTickets, getBookingById } = require('../../controllers/booking.controller');
const { protect, optionalProtect } = require('../../middlewares/auth.middleware');

router.get('/my-tickets', protect, getMyTickets);
router.get('/:id', optionalProtect, getBookingById);

module.exports = router;
