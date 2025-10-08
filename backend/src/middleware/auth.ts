import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ Auth failed: No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    console.log('✅ Auth successful:', decoded.email);
    req.admin = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('❌ Auth failed: Token expired at', error.expiredAt);
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      console.log('❌ Auth failed: Invalid token -', error.message);
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    console.log('❌ Auth failed: Unknown error -', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.admin?.role !== 'super-admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};
