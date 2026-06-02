import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
/**
 * requireRole — RBAC middleware factory (SRP: only enforces role authorization)
 * Usage: router.get('/admin', authenticate, requireRole('admin'), handler)
 */
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map