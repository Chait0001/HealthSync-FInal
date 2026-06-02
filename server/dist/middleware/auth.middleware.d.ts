import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/IUser';
export interface AuthRequest extends Request {
    user?: IUser;
}
/**
 * authenticate — JWT verification middleware (SRP: only verifies tokens)
 */
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map