import { BaseRepository } from './BaseRepository';
import { IAppointment, AppointmentStatus } from '../interfaces/IAppointment';
export declare class AppointmentRepository extends BaseRepository<IAppointment> {
    constructor();
    findByPatientId(patientId: string): Promise<IAppointment[]>;
    findByDoctorId(doctorId: string): Promise<IAppointment[]>;
    findByStatus(status: AppointmentStatus): Promise<IAppointment[]>;
    updateStatus(id: string, status: AppointmentStatus): Promise<IAppointment | null>;
    deleteByParticipant(userId: string): Promise<void>;
}
//# sourceMappingURL=AppointmentRepository.d.ts.map