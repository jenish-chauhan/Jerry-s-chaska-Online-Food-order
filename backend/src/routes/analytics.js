const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    getDashboardStats,
    getOrdersOverTime,
    getTopSellingItems,
    getOrdersByStatus
} = require('../controllers/analyticsController');

// All analytics routes require admin auth
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/orders-over-time', authMiddleware, adminMiddleware, getOrdersOverTime);
router.get('/top-items', authMiddleware, adminMiddleware, getTopSellingItems);
router.get('/orders-by-status', authMiddleware, adminMiddleware, getOrdersByStatus);

module.exports = router;
