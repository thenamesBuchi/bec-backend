require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bec-courses';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => console.error('✗ MongoDB connection error:', err));

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/health', require('./routes/health'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API docs: http://localhost:${PORT}/api/health\n`);
});
