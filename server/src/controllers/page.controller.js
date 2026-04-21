const StaticPage = require('../models/staticPage.model');

// @desc    Get all static pages
// @route   GET /api/pages
// @access  Public
exports.getPages = async (req, res) => {
    try {
        const pages = await StaticPage.find({}).select('title slug updatedAt');
        res.json({
            message: 'Pages fetched successfully',
            data: pages
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single static page by slug
// @route   GET /api/pages/:slug
// @access  Public
exports.getPageBySlug = async (req, res) => {
    try {
        const page = await StaticPage.findOne({ slug: req.params.slug });
        if (page) {
            res.json({
                message: 'Page fetched successfully',
                data: page
            });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a static page
// @route   POST /api/pages
// @access  Private/Admin
exports.createPage = async (req, res) => {
    try {
        const { title, slug, content } = req.body;
        
        const pageExists = await StaticPage.findOne({ slug });
        if (pageExists) {
            return res.status(400).json({ message: 'Page with this slug already exists' });
        }

        const page = await StaticPage.create({
            title,
            slug,
            content,
            lastUpdatedBy: req.user._id
        });

        res.status(201).json({
            message: 'Page created successfully',
            data: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a static page
// @route   PUT /api/pages/:id
// @access  Private/Admin
exports.updatePage = async (req, res) => {
    try {
        const page = await StaticPage.findById(req.params.id);

        if (page) {
            page.title = req.body.title || page.title;
            page.slug = req.body.slug || page.slug;
            page.content = req.body.content || page.content;
            page.lastUpdatedBy = req.user._id;

            const updatedPage = await page.save();
            res.json({
                message: 'Page updated successfully',
                data: updatedPage
            });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a static page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
exports.deletePage = async (req, res) => {
    try {
        const page = await StaticPage.findById(req.params.id);
        if (page) {
            await page.deleteOne();
            res.json({ message: 'Page deleted successfully' });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
