import { Response, NextFunction } from 'express';
import { IAppointmentService } from '../interfaces/IServices';
import { AuthRequest } from '../middleware/auth.middleware';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: IAppointmentService);
    getMyAppointments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    bookAppointment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AppointmentController.d.ts.map