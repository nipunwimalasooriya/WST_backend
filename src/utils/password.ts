import bcrypt from 'bcryptjs';
import logger from '../config/logger';

const saltRounds = 10;

/**
 * Hashes a plaintext password.
 * @param password - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compares a plaintext password with a hash.
 * @param password - The plaintext password.
 * @param hash - The stored password hash.
 * @returns A promise that resolves to true if they match, false otherwise.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Password comparison failed');
  }
};