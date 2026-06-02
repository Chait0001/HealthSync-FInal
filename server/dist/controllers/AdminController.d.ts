import { Request, Response, NextFunction } from 'express';
import { IAdminService } from '../interfaces/IServices';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: IAdminService);
    getStats: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllUsers: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPendingAppointments: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getScheduledAppointments: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    approveAppointment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AdminController.d.ts.map