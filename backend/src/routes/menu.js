const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    getAllItems,
    getItemsByCategory,
    createItem,
    updateItem,
    deleteItem,
    foodItemValidation
} = require('../controllers/menuController');

// Public routes
router.get('/', getAllItems);
router.get('/category/:category', getItemsByCategory);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, foodItemValidation, createItem);
router.put('/:id', authMiddleware, adminMiddleware, updateItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteItem);

module.exports = router;
