-- Create the database (schema) if it doesn't exist
CREATE DATABASE IF NOT EXISTS my_crud_app;

-- Use the newly created database
USE my_crud_app;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- This 'user_id' is the foreign key
    user_id INT NOT NULL, 
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    
    -- LONGTEXT can store very large strings, perfect for Base64 data
    imageData LONGTEXT, 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- This sets up the relationship
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);