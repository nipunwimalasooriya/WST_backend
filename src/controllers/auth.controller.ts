import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import pool from '../db/mysql';
import { NewUser, User, UserPayload } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import logger from '../config/logger';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Register attempt with missing fields');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [existingUsers] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      logger.warn(`Register attempt for existing email: ${email}`);
      return res.status(409).json({ message: 'User already exists' });
    }

    const password_hash = await hashPassword(password);

    const newUser: NewUser = { email, password_hash, role: 'USER' };

    const [result] = await pool.query('INSERT INTO users SET ?', [newUser]);
    
    const insertId = (result as any).insertId;

    if (!insertId) {
      throw new Error('Failed to get insertId');
    }

    logger.info(`New user registered: ${email} (ID: ${insertId})`);

    const payload: UserPayload = {
      id: insertId,
      email: email,
      role: 'USER'
    };

    const token = signToken(payload);
    res.status(201).json({ token, user: payload });

  } catch (error) {
    logger.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and get a token
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Login attempt with missing fields');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      logger.warn(`Login attempt for non-existent email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = signToken(payload);
    logger.info(`User logged in: ${email} (ID: ${user.id})`);
    res.status(200).json({ token, user: payload });

  } catch (error) {
    logger.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};