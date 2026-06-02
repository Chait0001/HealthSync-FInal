import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../interfaces/IServices';
/**
 * AuthController — SRP: only translates HTTP ↔ service calls.
 * DIP: depends on IAuthService interface, not a concrete class.
 */
export declare class AuthController {
    private readonly authService;
    constructor(authService: IAuthService);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: Request & {
        user?: any;
    }, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map