const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../../controllers/job.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes (Admin only for management, though controller handles it)
router.post('/', protect, authorize('administrator'), createJob);
router.put('/:id', protect, authorize('administrator'), updateJob);
router.delete('/:id', protect, authorize('administrator'), deleteJob);

module.exports = router;
