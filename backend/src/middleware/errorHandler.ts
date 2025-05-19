import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorCodes } from '../types/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred'
    }
  });
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Resource not found',
    code: 'NOT_FOUND',
    details: `Cannot ${req.method} ${req.originalUrl}`
  });
};

// Common error codes
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PROPERTY_NOT_FOUND: 'PROPERTY_NOT_FOUND',
  LOCATION_NOT_FOUND: 'LOCATION_NOT_FOUND',
  MARKET_DATA_NOT_FOUND: 'MARKET_DATA_NOT_FOUND',
  INVALID_ANALYSIS_PARAMS: 'INVALID_ANALYSIS_PARAMS'
} as const; 