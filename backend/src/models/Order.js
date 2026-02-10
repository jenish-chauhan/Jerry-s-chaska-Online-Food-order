const { pool } = require('../config/database');

class Order {
    static async create(orderData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Create order
            const { user_id, total_price, items } = orderData;
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
                [user_id, total_price, 'pending']
            );
            const orderId = orderResult.insertId;

            // Create order items
            for (const item of items) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, food_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.price]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const [orders] = await pool.execute(
            `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
            [id]
        );

        if (orders.length === 0) return null;

        const [items] = await pool.execute(
            `SELECT oi.*, fi.name, fi.image_url 
       FROM order_items oi 
       JOIN food_items fi ON oi.food_item_id = fi.id 
       WHERE oi.order_id = ?`,
            [id]
        );

        return { ...orders[0], items };
    }

    static async getByUserId(userId) {
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return orders;
    }

    static async getAll() {
        const [orders] = await pool.execute(
            `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
        );
        return orders;
    }

    static async updateStatus(id, status) {
        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );
        return this.getById(id);
    }
}

module.exports = Order;
