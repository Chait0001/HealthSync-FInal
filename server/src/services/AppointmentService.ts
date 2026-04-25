import { IAppointmentService, BookAppointmentDTO } from '../interfaces/IServices';
import { IAppointment } from '../interfaces/IAppointment';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class AppointmentService implements IAppointmentService {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly doctorRepo: DoctorRepository
  ) {}

  async getMyAppointments(userId: string, role: string): Promise<IAppointment[]> {
    if (role === 'patient') {
      return this.appointmentRepo.findByPatientId(userId);
    }

    if (role === 'doctor') {
      const doctor = await this.doctorRepo.findByUserId(userId);
      if (!doctor) throw new ApiError('Doctor profile not found', 404);
      return this.appointmentRepo.findByDoctorId(doctor._id.toString());
    }

    return []; // Admin sees nothing here — use AdminService instead
  }

  async bookAppointment(patientId: string, data: BookAppointmentDTO): Promise<IAppointment> {
    const { doctorId, date, reason } = data;
    if (!doctorId || !date || !reason) {
      throw new ApiError('Please provide doctorId, date and reason', 400);
    }

    return this.appointmentRepo.create({
      patientId: new Types.ObjectId(patientId),
      doctorId: new Types.ObjectId(doctorId),
      date: new Date(date),
      reason,
    } as any);
  }
}
