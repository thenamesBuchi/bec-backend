const express = require('express');
const router = express.Router();

// POST /api/admin/insert-courses
// Inserts courses into MongoDB
router.post('/insert-courses', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const coursesCollection = db.collection('courses');
        
        const courses = req.body; // Expects an array of courses
        
        if (!Array.isArray(courses)) {
            return res.status(400).json({ error: 'Expected an array of courses' });
        }
        
        const result = await coursesCollection.insertMany(courses);
        res.json({
            success: true,
            insertedCount: result.insertedCount,
            ids: result.insertedIds
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/clear-courses
// Clears all courses from the database (for testing)
router.get('/clear-courses', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const coursesCollection = db.collection('courses');
        
        const result = await coursesCollection.deleteMany({});
        res.json({
            success: true,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;