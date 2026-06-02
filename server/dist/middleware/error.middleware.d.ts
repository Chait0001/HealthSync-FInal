import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
/**
 * errorMiddleware — Global Express error handler (SRP: only formats errors into API responses)
 * Must have 4 parameters to be recognized by Express as an error middleware.
 */
export declare const errorMiddleware: (err: Error | ApiError, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map