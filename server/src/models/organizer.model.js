const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    categories: [{
        type: String
    }],
    logo: String,
    socialLinks: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
        youtube: String,
        otherWebsite: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Generate slug from name before saving
organizerSchema.pre('save', async function () {
    if (!this.isModified('name') && this.slug) {
        return;
    }

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')  // Remove all non-word chars
            .replace(/--+/g, '-');    // Replace multiple - with single -
    };

    let baseSlug = slugify(this.name);
    let slug = baseSlug;
    let count = 1;

    // Check for uniqueness
    while (await mongoose.model('Organizer').findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
});

module.exports = mongoose.model('Organizer', organizerSchema);
