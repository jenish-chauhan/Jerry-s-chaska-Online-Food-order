const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getOrderById,
    confirmPickup,
    orderValidation
} = require('../controllers/orderController');

// Protected routes (require authentication)
router.post('/', authMiddleware, orderValidation, createOrder);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.patch('/:id/confirm-pickup', authMiddleware, confirmPickup);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;
