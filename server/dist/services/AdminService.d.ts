import { IAdminService } from '../interfaces/IServices';
import { IUser } from '../interfaces/IUser';
import { IAppointment } from '../interfaces/IAppointment';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
export declare class AdminService implements IAdminService {
    private readonly userRepo;
    private readonly doctorRepo;
    private readonly appointmentRepo;
    constructor(userRepo: UserRepository, doctorRepo: DoctorRepository, appointmentRepo: AppointmentRepository);
    getStats(): Promise<{
        totalUsers: number;
        totalDoctors: number;
        totalPatients: number;
    }>;
    getAllUsers(): Promise<IUser[]>;
    deleteUser(id: string): Promise<void>;
    getPendingAppointments(): Promise<IAppointment[]>;
    getScheduledAppointments(): Promise<IAppointment[]>;
    approveAppointment(id: string): Promise<IAppointment>;
}
//# sourceMappingURL=AdminService.d.ts.map