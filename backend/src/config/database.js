const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jerrys_chaska',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection (throws on failure — caller decides how to handle)
const testConnection = async () => {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
};

module.exports = { pool, testConnection };
