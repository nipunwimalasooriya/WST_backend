import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from '../config/logger'; // <-- Import logger

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  port: Number(process.env.DB_PORT),
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    "rejectUnauthorized": false
  }
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    // Use logger.info instead of console.log
    logger.info('Successfully connected to the database.');
    connection.release();
  } catch (error) {
    // Use logger.error instead of console.error
    logger.error('Error connecting to the database:', error);
    throw error;
  }
};

export default pool;