import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';
import { AnalysisController } from './controllers/analysisController';

// Load environment variables
dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1', router);

// Routes
const analysisController = new AnalysisController();
app.post('/api/analysis', analysisController.calculateAnalysis);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 