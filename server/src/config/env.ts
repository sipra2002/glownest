import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'glownest_dev_jwt_access_secret_123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'glownest_dev_jwt_refresh_secret_456',
  ANALYSIS_PROVIDER: process.env.ANALYSIS_PROVIDER || 'demo',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
};

