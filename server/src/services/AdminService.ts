import bcrypt from 'bcryptjs';
import { IAdminService } from '../interfaces/IServices';
import { IUser } from '../interfaces/IUser';
import { IAppointment } from '../interfaces/IAppointment';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { PermissionRepository } from '../repositories/PermissionRepository';
import { RoleService } from './RoleService';
import { ApiError } from '../utils/ApiError';

export class AdminService implements IAdminService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly doctorRepo: DoctorRepository,
    private readonly appointmentRepo: AppointmentRepository,
    private readonly roleRepo: RoleRepository,
    private readonly roleService: RoleService,
    private readonly permRepo: PermissionRepository
  ) {}


async getAllRoles(): Promise<any[]> {
  return this.roleRepo.findAllActive();         
}

async getAllPermissions(): Promise<any[]> {
  return this.permRepo.findAllActive();
}

  async assignRoleToUser(userId: string, roleKey: string, adminId: string) {
    return this.roleService.assignRoleToUser(userId, roleKey, adminId);
  }

  async createUser(data: {
    name: string; email: string; password: string; role: string;
    phone?: string; gender?: string; specialization?: string;
    experience?: string; feesPerConsultation?: string; department?: string;
  }): Promise<IUser> {
    const { name, email, password, role, ...extra } = data;
    if (!name || !email || !password || !role) throw new ApiError('name, email, password and role are required', 400);
    const exists = await this.userRepo.findByEmail(email);
    if (exists) throw new ApiError('A user with this email already exists', 409);
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, password: hashed, role, ...extra } as any);
    if (role === 'doctor') {
      await this.doctorRepo.create({
        userId: user._id,
        specialization: extra.specialization,
        experience: extra.experience,
        feesPerConsultation: extra.feesPerConsultation,
        department: extra.department,
      } as any);
    }
    return user;
  }

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
