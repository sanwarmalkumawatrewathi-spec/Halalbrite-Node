const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String
    },
    icon: {
        type: String // URL or icon identifier
    }
}, { timestamps: true });

// Pre-save hook to generate slug if not provided
categorySchema.pre('save', async function() {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
});

module.exports = mongoose.model('Category', categorySchema);
