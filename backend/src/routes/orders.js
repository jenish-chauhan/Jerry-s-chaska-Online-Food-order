const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    orderValidation
} = require('../controllers/orderController');

// Protected routes (require authentication)
router.post('/', authMiddleware, orderValidation, createOrder);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
