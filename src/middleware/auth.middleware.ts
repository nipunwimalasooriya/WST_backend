import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET!;

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

/**
 * Middleware to verify JWT and attach user payload to request.
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

      // Attach user to the request object
      req.user = decoded;
      
      logger.debug(`User authenticated: ${decoded.email} (ID: ${decoded.id})`);
      next();
    } catch (error) {
      logger.warn('Token verification failed', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    logger.warn('Access attempt with no token');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    logger.warn(`Forbidden: Non-admin user ${req.user?.email} attempted admin action.`);
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};