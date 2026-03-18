const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getAllUsers } = require('../controllers/adminController');

// All routes here should be protected by admin middleware
router.use(authMiddleware, adminMiddleware);

// Admin orders endpoint
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);

// Admin products placeholder endpoint for future
router.get('/products', (req, res) => {
    res.json({ message: 'Admin products endpoint' });
});

module.exports = router;
