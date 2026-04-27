const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser, getRoles, getStats, upgradeToOrganizer } = require('../../controllers/user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Publicly accessible to any authenticated user
router.post('/upgrade-to-organizer', protect, upgradeToOrganizer);

// Routes protected by 'list_users' permission or 'administrator' role
router.get('/stats', protect, authorize('list_users'), getStats);
router.get('/', protect, authorize('list_users'), getUsers);
router.get('/roles', protect, authorize('manage_roles'), getRoles);
router.get('/:id', protect, authorize('view_user'), getUserById);
router.put('/:id', protect, authorize('edit_user'), updateUser);
router.delete('/:id', protect, authorize('delete_user'), deleteUser);

module.exports = router;
