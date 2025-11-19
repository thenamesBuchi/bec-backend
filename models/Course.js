const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        price: { type: Number, required: true },
        spaces: { type: Number, default: 30 },
        imageUrl: { type: String, default: '' },
        description: { type: String, default: '' },
        category: { type: String, default: 'General' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
