const Category = require('../models/category.model');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description, icon } = req.body;
        
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            icon
        });

        res.status(201).json({
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('❌ Error creating category:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = req.body.name || category.name;
            category.slug = req.body.slug || category.slug;
            category.description = req.body.description || category.description;
            category.icon = req.body.icon || category.icon;

            const updatedCategory = await category.save();
            res.json({
                message: 'Category updated successfully',
                data: updatedCategory
            });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
