require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/health', require('./routes/health'));

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// -------------------------------------------------------
//  🔥 Corrected for Render + MongoDB Atlas
// -------------------------------------------------------
const mongoURI = process.env.MONGO_URI;     // MUST come from environment
if (!mongoURI) {
    console.error('❌ MONGO_URI environment variable is not set. Please set it in your deployment environment (e.g., Render dashboard).');
    process.exit(1);
}
const dbName = 'bec-courses';               // Atlas auto-creates database

const client = new MongoClient(mongoURI);


async function start() {
    try {
        await client.connect();
        const db = client.db(dbName);

        app.locals.db = db;
        app.locals.collections = {
            courses: db.collection('courses'),
            orders: db.collection('orders'),

        };

        console.log('✓ MongoDB connected');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 API docs: http://localhost:${PORT}/api/health\n`);
        });

    } catch (err) {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    }
}

start();
