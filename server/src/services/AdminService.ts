import { IAdminService } from '../interfaces/IServices';
import { IUser } from '../interfaces/IUser';
import { IAppointment } from '../interfaces/IAppointment';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { ApiError } from '../utils/ApiError';

export class AdminService implements IAdminService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly doctorRepo: DoctorRepository,
    private readonly appointmentRepo: AppointmentRepository
  ) {}

  async getStats(): Promise<{ totalUsers: number; totalDoctors: number; totalPatients: number }> {
    const [totalUsers, totalDoctors, totalPatients] = await Promise.all([
      this.userRepo.countAll(),
      this.userRepo.countByRole('doctor'),
      this.userRepo.countByRole('patient'),
    ]);
    return { totalUsers, totalDoctors, totalPatients };
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepo.findAllWithoutPassword();
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new ApiError('User not found', 404);

    if (user.role === 'doctor') {
      await this.doctorRepo.deleteByUserId(user._id.toString());
    }

    await this.appointmentRepo.deleteByParticipant(user._id.toString());
    await this.userRepo.delete(id);
  }

  async getPendingAppointments(): Promise<IAppointment[]> {
    return this.appointmentRepo.findByStatus('pending');
  }

  async getScheduledAppointments(): Promise<IAppointment[]> {
    return this.appointmentRepo.findByStatus('approved');
  }

  async approveAppointment(id: string): Promise<IAppointment> {
    const appt = await this.appointmentRepo.updateStatus(id, 'approved');
    if (!appt) throw new ApiError('Appointment not found', 404);
    return appt;
  }
}
