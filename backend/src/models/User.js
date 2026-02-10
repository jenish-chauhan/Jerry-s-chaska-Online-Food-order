const { pool } = require('../config/database');

class User {
    static async create(userData) {
        const { name, email, password_hash, role = 'user' } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, role]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, created_at FROM users'
        );
        return rows;
    }
}

module.exports = User;
