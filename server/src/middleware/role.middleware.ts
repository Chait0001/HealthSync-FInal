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


// ADD this new export (keep requireRole as-is for backward compat):
export const requirePermission = (...permissions: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }
    const cache = req.user.permissions_cache ?? [];
    const hasPermission = permissions.every(p => cache.includes(p));
    if (!hasPermission) {
      return next(new ApiError(`Access denied: missing permission(s): ${permissions.join(', ')}`, 403));
    }
    next();
  };
};