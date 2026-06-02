import { IAppointmentService, BookAppointmentDTO } from '../interfaces/IServices';
import { IAppointment } from '../interfaces/IAppointment';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
export declare class AppointmentService implements IAppointmentService {
    private readonly appointmentRepo;
    private readonly doctorRepo;
    constructor(appointmentRepo: AppointmentRepository, doctorRepo: DoctorRepository);
    getMyAppointments(userId: string, role: string): Promise<IAppointment[]>;
    bookAppointment(patientId: string, data: BookAppointmentDTO): Promise<IAppointment>;
}
//# sourceMappingURL=AppointmentService.d.ts.map