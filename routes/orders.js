const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

function ordersCollection(req) {
    return req.app.locals.collections.orders;
}

function coursesCollection(req) {
    return req.app.locals.collections.courses;
}

// Helper to populate items' courseId with course data when possible
async function populateOrderItems(req, order) {
    if (!order.items || !Array.isArray(order.items)) return order;
    const coursesCol = coursesCollection(req);
    const populatedItems = await Promise.all(
        order.items.map(async (it) => {
            try {
                const cid = typeof it.courseId === 'string' ? new ObjectId(it.courseId) : it.courseId;
                const course = await coursesCol.findOne({ _id: cid });
                return { ...it, course: course || null };
            } catch {
                return { ...it, course: null };
            }
        })
    );
    return { ...order, items: populatedItems };
}

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await ordersCollection(req).find({}).toArray();
        const populated = await Promise.all(orders.map((o) => populateOrderItems(req, o)));
        res.json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const order = await ordersCollection(req).findOne({ _id: new ObjectId(id) });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        const populated = await populateOrderItems(req, order);
        res.json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new order (checkout)
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, customerEmail = '', items, totalPrice } = req.body;

        if (!customerName || !customerPhone || !items || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const coursesCol = coursesCollection(req);

        // Validate and atomically reduce course spaces where possible
        for (let item of items) {
            const courseId = new ObjectId(item.courseId);
            const quantity = item.quantity || 1;

            // Try to decrement spaces only if enough spaces exist
            const updated = await coursesCol.findOneAndUpdate(
                { _id: courseId, spaces: { $gte: quantity } },
                { $inc: { spaces: -quantity } },
                { returnDocument: 'after' }
            );

            if (!updated.value) {
                const courseExists = await coursesCol.findOne({ _id: courseId });
                if (!courseExists) {
                    return res.status(404).json({ error: `Course ${item.courseId} not found` });
                }
                return res.status(400).json({ error: `Not enough spaces for ${courseExists.title}` });
            }
        }

        const now = new Date();
        const orderDoc = { customerName, customerPhone, customerEmail, items, totalPrice, status: 'completed', createdAt: now, updatedAt: now };
        const result = await ordersCollection(req).insertOne(orderDoc);
        const saved = await ordersCollection(req).findOne({ _id: result.insertedId });
        const populated = await populateOrderItems(req, saved);
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order status or fields
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const update = { ...req.body, updatedAt: new Date() };
        const result = await ordersCollection(req).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Order not found' });
        const populated = await populateOrderItems(req, result.value);
        res.json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
