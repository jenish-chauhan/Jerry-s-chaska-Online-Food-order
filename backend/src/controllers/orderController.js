const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');

// Validation rules
const orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('total_price').isFloat({ min: 0 }).withMessage('Total price must be a positive number')
];

// Create new order
const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { items, total_price } = req.body;
        const user_id = req.user.id;

        const orderId = await Order.create({
            user_id,
            total_price,
            items
        });

        const order = await Order.getById(orderId);

        res.status(201).json({
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;

        // Users can only see their own orders, admins can see any
        if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orders = await Order.getByUserId(userId);
        res.json({ data: orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json({ data: orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get single order
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.getById(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Users can only see their own orders, admins can see any
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ data: order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.updateStatus(id, status);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    orderValidation
};
