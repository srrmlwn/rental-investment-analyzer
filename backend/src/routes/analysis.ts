import express from 'express';
import { analysisController } from '../controllers/analysisController';

const router = express.Router();

// TODO: Add request validation middleware
router.post('/calculate', analysisController.calculateAnalysis.bind(analysisController));

export default router; 