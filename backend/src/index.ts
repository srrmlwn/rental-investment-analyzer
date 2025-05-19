import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import router from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/v1', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection before starting server
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Could not connect to the database');
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 