const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

function coursesCollection(req) {
    return req.app.locals.collections.courses;
}

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await coursesCollection(req).find({}).toArray();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET course by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const course = await coursesCollection(req).findOne({ _id: new ObjectId(id) });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new course
router.post('/', async (req, res) => {
    try {
        const { title, author, price, spaces = 30, imageUrl = '', category = 'General' } = req.body;
        if (!title || !author || price === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const now = new Date();
        const doc = { title, author, price, spaces, imageUrl, category, createdAt: now, updatedAt: now };
        const result = await coursesCollection(req).insertOne(doc);
        res.status(201).json({ _id: result.insertedId, ...doc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update course
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const update = { ...req.body, updatedAt: new Date() };
        const result = await coursesCollection(req).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Course not found' });
        res.json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE course
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await coursesCollection(req).deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Course not found' });
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
