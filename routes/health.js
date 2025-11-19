const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: '✓ API is healthy',
        endpoints: {
            courses: '/api/courses',
            orders: '/api/orders',
        },
    });
});

module.exports = router;
