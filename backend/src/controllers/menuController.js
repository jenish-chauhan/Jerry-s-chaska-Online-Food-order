const { body, validationResult } = require('express-validator');
const FoodItem = require('../models/FoodItem');

// Validation rules
const foodItemValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required')
];

// Get all menu items
const getAllItems = async (req, res) => {
    try {
        const items = await FoodItem.getAll();
        res.json({ data: items });
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};

// Get items by category
const getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const items = await FoodItem.getByCategory(category);
        res.json({ data: items });
    } catch (error) {
        console.error('Get category items error:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

// Create new menu item (admin only)
const createItem = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const itemId = await FoodItem.create(req.body);
        const item = await FoodItem.getById(itemId);

        res.status(201).json({
            message: 'Menu item created successfully',
            data: item
        });
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
};

// Update menu item (admin only)
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await FoodItem.update(id, req.body);

        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        res.json({
            message: 'Menu item updated successfully',
            data: item
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
};

// Delete menu item (admin only)
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await FoodItem.delete(id);

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

module.exports = {
    getAllItems,
    getItemsByCategory,
    createItem,
    updateItem,
    deleteItem,
    foodItemValidation
};
