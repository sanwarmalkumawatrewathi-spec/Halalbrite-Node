const FAQ = require('../models/faq.model');

// @desc    Get all active FAQs
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, category: 1 });
        res.json({
            message: 'FAQs fetched successfully',
            data: faqs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get FAQs by category
// @route   GET /api/faqs/:category
// @access  Public
exports.getFAQsByCategory = async (req, res) => {
    try {
        const faqs = await FAQ.find({ 
            isActive: true, 
            category: { $regex: req.params.category, $options: 'i' } 
        }).sort({ order: 1 });
        
        res.json({
            message: 'FAQs fetched successfully',
            data: faqs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an FAQ (Admin only)
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json({
            message: 'FAQ created successfully',
            data: faq
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an FAQ (Admin only)
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);

        if (faq) {
            Object.assign(faq, req.body);
            const updatedFAQ = await faq.save();
            res.json({
                message: 'FAQ updated successfully',
                data: updatedFAQ
            });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an FAQ (Admin only)
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            await faq.deleteOne();
            res.json({ message: 'FAQ deleted successfully' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
