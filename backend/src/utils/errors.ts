export enum ErrorCodes {
  PROPERTY_NOT_FOUND = 'PROPERTY_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCodes,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 