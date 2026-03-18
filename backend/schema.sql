-- Jerry's Chaska Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS jerrys_chaska;
USE jerrys_chaska;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (available)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
);

-- Insert admin user (password: jerry@612)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'jenishchauhan.08@gmail.com', '$2b$10$gmevWbWzB1ttkduSgKQKgO7k5S4yFz1lOkWQ0D8xEfWpBKl6nlCF.', 'admin');

-- Insert sample food items
INSERT INTO food_items (name, description, price, image_url, category, available) VALUES
('Classic Cheese Burger', 'Juicy beef patty with cheddar cheese, lettuce, tomato, and house sauce.', 8.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 'Burgers', TRUE),
('Spicy Chicken Burger', 'Crispy chicken fillet with spicy mayo and pickles.', 9.99, 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500', 'Burgers', TRUE),
('Margherita Pizza', 'Classic tomato and mozzarella pizza with fresh basil.', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', 'Pizza', TRUE),
('Pepperoni Pizza', 'Spicy pepperoni with mozzarella and tomato sauce.', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', 'Pizza', TRUE),
('Cola', 'Chilled cola beverage.', 2.99, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', 'Beverages', TRUE),
('Chocolate Lava Cake', 'Warm chocolate cake with a molten center.', 6.99, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500', 'Desserts', TRUE);
