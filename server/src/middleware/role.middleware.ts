import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';

/**
 * requireRole — RBAC middleware factory (SRP: only enforces role authorization)
 * Usage: router.get('/admin', authenticate, requireRole('admin'), handler)
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError('Access denied: insufficient permissions', 403));
    }
    next();
  };
};
