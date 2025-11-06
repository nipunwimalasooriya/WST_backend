import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import pool from '../db/mysql';
import { Product, NewProduct } from '../types';
import logger from '../config/logger';

// --- getAllProducts and getProductById ---
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const [products] = await pool.query<Product[] & RowDataPacket[]>(
      'SELECT id, user_id, name, description, price, imageData, created_at, updated_at FROM products ORDER BY created_at DESC'
    );
    logger.info(`Fetched ${products.length} products`);
    res.status(200).json(products);
  } catch (error) {
    logger.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [products] = await pool.query<Product[] & RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    if (products.length === 0) {
      logger.warn(`Attempt to fetch non-existent product: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`Fetched product: ${id}`);
    res.status(200).json(products[0]);
  } catch (error) {
    logger.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- createProduct (No changes) ---
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, imageData } = req.body;
  const userId = req.user?.id;
  if (!name || !price) {
    logger.warn(`Create product attempt with missing fields by user: ${userId}`);
    return res.status(400).json({ message: 'Name and price are required' });
  }
  try {
    const newProduct: NewProduct = {
      user_id: userId!,
      name,
      description: description || null,
      price: parseFloat(price),
      imageData: imageData || null,
    };
    const [result] = await pool.query<OkPacket>(
      'INSERT INTO products SET ?',
      [newProduct]
    );
    const createdProduct: Product = {
        ...newProduct,
        id: result.insertId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
    logger.info(`New product created: ${name} (ID: ${result.insertId}) by user: ${userId}`);
    res.status(201).json(createdProduct);
  } catch (error) {
    logger.error(`Error creating product by user ${userId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};


// --- updateProduct ---
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, imageData } = req.body;
  const userId = req.user?.id;

  if (!name || !price) {
    logger.warn(`Update product attempt with missing fields for product: ${id} by user: ${userId}`);
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const [products] = await pool.query<Product[] & RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      logger.warn(`Update attempt for non-existent product: ${id} by user: ${userId}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    const updatedFields = {
      name,
      description: description || product.description,
      price: parseFloat(price),
      imageData: imageData || product.imageData,
    };

    await pool.query('UPDATE products SET ? WHERE id = ?', [updatedFields, id]);
    
    const updatedProduct = { ...product, ...updatedFields };

    logger.info(`Product updated: ${id} by user: ${userId}`);
    res.status(200).json(updatedProduct);
  } catch (error) {
    logger.error(`Error updating product ${id} by user ${userId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- deleteProduct ---
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const [products] = await pool.query<Product[] & RowDataPacket[]>(
      'SELECT user_id FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      logger.warn(`Delete attempt for non-existent product: ${id} by user: ${userId}`);
      return res.status(404).json({ message: 'Product not found' });
    }
    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    logger.info(`Product deleted: ${id} by user: ${userId}`);
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    logger.error(`Error deleting product ${id} by user ${userId}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};