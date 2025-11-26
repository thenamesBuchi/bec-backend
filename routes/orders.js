const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

function ordersCollection(req) {
    return req.app.locals.collections.orders;
}

function coursesCollection(req) {
    return req.app.locals.collections.courses;
}

// Helper: Populate course data inside each order item
async function populateOrderItems(req, order) {
    if (!order?.items || !Array.isArray(order.items)) return order;

    const coursesCol = coursesCollection(req);

    const populatedItems = await Promise.all(
        order.items.map(async (item) => {
            try {
                const courseId = new ObjectId(item.courseId);
                const course = await coursesCol.findOne({ _id: courseId });
                return { ...item, course: course || null };
            } catch {
                return { ...item, course: null };
            }
        })
    );

    return { ...order, items: populatedItems };
}

/* -------------------------------
   GET all orders
-------------------------------- */
router.get('/', async (req, res) => {
    try {
        const orders = await ordersCollection(req).find({}).toArray();
        const populated = await Promise.all(orders.map((o) => populateOrderItems(req, o)));
        res.json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------------
   GET order by ID
-------------------------------- */
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

/* -------------------------------
   POST: Create new order (Checkout)
-------------------------------- */
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            customerEmail = '',
            items,
            totalPrice
        } = req.body;

        if (!customerName || !customerPhone || !items || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const coursesCol = coursesCollection(req);

        // Validate spaces & decrement atomically
        for (let item of items) {
            const quantity = item.quantity || 1;

            let courseId;
            try {
                courseId = new ObjectId(item.courseId);
            } catch {
                return res.status(400).json({ error: 'Invalid courseId format' });
            }

            const updated = await coursesCol.findOneAndUpdate(
                { _id: courseId, spaces: { $gte: quantity } },
                { $inc: { spaces: -quantity } },
                { returnDocument: 'after' }
            );

            if (!updated.value) {
                const exists = await coursesCol.findOne({ _id: courseId });
                if (!exists) {
                    return res.status(404).json({ error: `Course not found: ${item.courseId}` });
                }
                return res.status(400).json({ error: `Not enough spaces for ${exists.title}` });
            }
        }

        const now = new Date();

        const orderDoc = {
            customerName,
            customerPhone,
            customerEmail,
            items,
            totalPrice,
            status: 'completed',
            createdAt: now,
            updatedAt: now
        };

        const result = await ordersCollection(req).insertOne(orderDoc);
        const saved = await ordersCollection(req).findOne({ _id: result.insertedId });

        const populated = await populateOrderItems(req, saved);

        res.status(201).json(populated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -------------------------------
   PUT: Update an order
-------------------------------- */
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const update = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await ordersCollection(req).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const populated = await populateOrderItems(req, result.value);
        res.json(populated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
