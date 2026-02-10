const { pool } = require('../config/database');

class FoodItem {
    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM food_items WHERE available = TRUE ORDER BY category, name'
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM food_items WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getByCategory(category) {
        const [rows] = await pool.execute(
            'SELECT * FROM food_items WHERE category = ? AND available = TRUE',
            [category]
        );
        return rows;
    }

    static async create(itemData) {
        const { name, description, price, image_url, category } = itemData;
        const [result] = await pool.execute(
            'INSERT INTO food_items (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image_url, category]
        );
        return result.insertId;
    }

    static async update(id, itemData) {
        const { name, description, price, image_url, category, available } = itemData;
        await pool.execute(
            'UPDATE food_items SET name = ?, description = ?, price = ?, image_url = ?, category = ?, available = ? WHERE id = ?',
            [name, description, price, image_url, category, available, id]
        );
        return this.getById(id);
    }

    static async delete(id) {
        await pool.execute('DELETE FROM food_items WHERE id = ?', [id]);
    }
}

module.exports = FoodItem;
