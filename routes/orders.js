const express = require('express');
const Order = require('../models/Order');
const Course = require('../models/Course');

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({}).populate('items.courseId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.courseId');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new order (checkout)
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, customerEmail, items, totalPrice } = req.body;

        if (!customerName || !customerPhone || !items || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate and update course spaces
        for (let item of items) {
            const course = await Course.findById(item.courseId);
            if (!course) {
                return res.status(404).json({ error: `Course ${item.courseId} not found` });
            }
            if (course.spaces < item.quantity) {
                return res.status(400).json({ error: `Not enough spaces for ${course.title}` });
            }
            // Reduce spaces
            course.spaces -= item.quantity;
            await course.save();
        }

        // Create order
        const order = new Order({
            customerName,
            customerPhone,
            customerEmail,
            items,
            totalPrice,
            status: 'completed',
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order status
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('items.courseId');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
