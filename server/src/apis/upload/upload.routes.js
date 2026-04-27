const express = require('express');
const router = express.Router();
const { uploadSingle, handleUpload } = require('../../controllers/upload.controller');
const { protect } = require('../../middlewares/auth.middleware');

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', protect, uploadSingle, handleUpload);

module.exports = router;
