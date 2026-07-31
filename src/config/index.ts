import path from 'path';

/**
 * Centralized Application Configuration
 * All environment-specific parameters and filesystem storage routing
 * are defined here to maintain separation of concerns.
 */
export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  storage: {
    defaultDataDirectory: path.resolve(__dirname, '../../data'),
    defaultFilePath: path.resolve(__dirname, '../../data/expenses.json'),
  },
  apiPrefix: '/api',
  docsPrefix: '/docs',
};
