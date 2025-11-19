const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        customerEmail: { type: String, default: '' },
        items: [
            {
                courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
                title: String,
                price: Number,
                quantity: { type: Number, default: 1 },
            },
        ],
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
