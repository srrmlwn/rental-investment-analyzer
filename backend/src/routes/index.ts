import express from 'express';
import analysisRoutes from './analysis';

const router = express.Router();

router.use('/api/v1/analysis', analysisRoutes);

export default router; 