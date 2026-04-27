const Inquiry = require('../models/inquiry.model');

// @desc    Submit a contact form inquiry
// @route   POST /api/inquiries
// @access  Public
exports.submitInquiry = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;

        const inquiry = await Inquiry.create({
            fullName,
            email,
            subject,
            message
        });

        res.status(201).json({
            message: 'Your message has been sent successfully. We will get back to you soon!',
            data: inquiry
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({
            message: 'Inquiries fetched successfully',
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (inquiry) {
            inquiry.status = req.body.status || inquiry.status;
            inquiry.adminNotes = req.body.adminNotes || inquiry.adminNotes;

            const updatedInquiry = await inquiry.save();
            res.json({
                message: 'Inquiry updated successfully',
                data: updatedInquiry
            });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (inquiry) {
            await inquiry.deleteOne();
            res.json({ message: 'Inquiry deleted successfully' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
