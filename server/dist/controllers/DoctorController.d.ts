import { Request, Response, NextFunction } from 'express';
import { IDoctorService } from '../interfaces/IServices';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: IDoctorService);
    getAllDoctors: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMyProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateMyProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=DoctorController.d.ts.map