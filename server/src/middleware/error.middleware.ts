import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * errorMiddleware — Global Express error handler (SRP: only formats errors into API responses)
 * Must have 4 parameters to be recognized by Express as an error middleware.
 */
export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    process.env.NODE_ENV === 'production' && !(err instanceof ApiError)
      ? 'Internal Server Error'
      : err.message;

  res.status(statusCode).json(ApiResponse.error(message, statusCode));
};
