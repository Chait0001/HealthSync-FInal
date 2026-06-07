import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';

/**
 * requireRole — RBAC middleware factory (SRP: only enforces role authorization)
 * Usage: router.get('/admin', authenticate, requireRole('admin'), handler)
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Access denied: insufficient permissions', 403));
    }
    // Check legacy role field first (fast path for patient/doctor/admin)
    if (roles.includes(req.user.role)) {
      return next();
    }
    // Also check the roles[] array (supports custom roles)
    const userRoleKeys = (req.user as any).roles?.map((r: any) => r.role_key) ?? [];
    if (userRoleKeys.some((k: string) => roles.includes(k))) {
      return next();
    }
    return next(new ApiError('Access denied: insufficient permissions', 403));
  };
};


// ADD this new export (keep requireRole as-is for backward compat):
export const requirePermission = (...permissions: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }
    const cache = req.user.permissions_cache ?? [];
    // ANY of the listed permissions is sufficient (OR semantics)
    const hasPermission = permissions.some(p => cache.includes(p));
    if (!hasPermission) {
      return next(new ApiError(`Access denied: missing required permission`, 403));
    }
    next();
  };
};