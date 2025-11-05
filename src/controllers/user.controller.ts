import { Request, Response } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import pool from '../db/mysql';
import { User } from '../types';
import logger from '../config/logger';

/**
 * @route   GET /api/users
 * @desc    Get all users (for Admin)
 * @access  Private (Admin)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Select all fields *except* the password hash
    const [users] = await pool.query<User[] & RowDataPacket[]>(
      'SELECT id, email, role, created_at FROM users'
    );
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update a user's role (for Admin)
 * @access  Private (Admin)
 */
export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body; 

  if (!role || (role !== 'USER' && role !== 'ADMIN')) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  // Prevent an admin from accidentally demoting themselves
  if (Number(id) === req.user?.id) {
     logger.warn(`Admin ${req.user?.email} attempted to change their own role.`);
     return res.status(400).json({ message: 'Admins cannot change their own role.' });
  }

  try {
    const [result] = await pool.query<OkPacket>(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    logger.info(`Admin ${req.user?.email} changed user ${id} role to ${role}`);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    logger.error(`Error updating user role for ${id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};