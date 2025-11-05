import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  logger.error('No JWT_SECRET defined in .env file');
  process.exit(1);
}

/**
 * Signs a user payload to create a JWT.
 * @param payload - The user data to store in the token (id, email).
 * @returns The signed JWT as a string.
 */
export const signToken = (payload: UserPayload): string => {
  try {
    const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: '1d' }); // Token expires in 1 day
    return token;
  } catch (error) {
    logger.error('Error signing JWT:', error);
    throw new Error('Token signing failed');
  }
};