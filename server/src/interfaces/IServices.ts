import { IUser, AuthResponse, RegisterDTO, LoginDTO } from './IUser';
import { IDoctor, UpdateDoctorDTO } from './IDoctor';
import { IAppointment, BookAppointmentDTO } from './IAppointment';
import { JwtPayload } from 'jsonwebtoken';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface IAuthService {
  register(data: RegisterDTO): Promise<AuthResponse>;
  login(data: LoginDTO): Promise<AuthResponse>;
  verifyToken(token: string): Promise<JwtPayload & { id: string }>;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────
export interface IDoctorService {
  getAllDoctors(): Promise<IDoctor[]>;
  getDoctorByUserId(userId: string): Promise<IDoctor | null>;
  updateDoctorProfile(userId: string, data: UpdateDoctorDTO): Promise<IDoctor | null>;
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export interface IAppointmentService {
  getMyAppointments(userId: string, role: string): Promise<IAppointment[]>;
  bookAppointment(patientId: string, data: BookAppointmentDTO): Promise<IAppointment>;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface IAdminService {
  getStats(): Promise<{ totalUsers: number; totalDoctors: number; totalPatients: number }>;
  getAllUsers(): Promise<IUser[]>;
  deleteUser(id: string): Promise<void>;
  getPendingAppointments(): Promise<IAppointment[]>;
  getScheduledAppointments(): Promise<IAppointment[]>;
  approveAppointment(id: string): Promise<IAppointment>;
}

// Re-export all DTOs for convenience
export { AuthResponse, RegisterDTO, LoginDTO, UpdateDoctorDTO, BookAppointmentDTO };
