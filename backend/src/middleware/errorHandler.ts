import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handler middleware
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details
    });
    return;
  }

  // Handle database errors
  if (err.name === 'PostgresError') {
    res.status(500).json({
      error: 'Database error occurred',
      code: 'DATABASE_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  }

  // Handle validation errors (from express-validator)
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.message
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
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