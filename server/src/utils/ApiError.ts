/**
 * ApiError — Custom operational error class.
 * isOperational = true means it is a known/expected error (e.g. 404, 400).
 * Unhandled errors will have isOperational = false and can be caught by the global handler.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Maintain prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, ApiError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
