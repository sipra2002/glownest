import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(
      res,
      'Validation failed for input data',
      422,
      'VALIDATION_ERROR',
      formattedErrors
    );
  }

  console.error('Unhandled internal error:', err);
  return sendError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    500,
    'INTERNAL_SERVER_ERROR'
  );
}

