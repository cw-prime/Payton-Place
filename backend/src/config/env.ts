import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST before any other imports use them
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payton-place';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

console.log('🔑 Environment loaded - JWT_SECRET:', JWT_SECRET.substring(0, 10) + '...');
