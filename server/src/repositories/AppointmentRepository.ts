import { Types } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { AppointmentModel } from '../models/Appointment.model';
import { IAppointment, AppointmentStatus } from '../interfaces/IAppointment';

export class AppointmentRepository extends BaseRepository<IAppointment> {
  constructor() {
    super(AppointmentModel);
  }

  async findByPatientId(patientId: string): Promise<IAppointment[]> {
    return this.model
      .find({ patientId: new Types.ObjectId(patientId) })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort({ date: 1 })
      .exec();
  }

  async findByDoctorId(doctorId: string): Promise<IAppointment[]> {
    return this.model
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .populate('patientId', 'name email')
      .sort({ date: 1 })
      .exec();
  }

  async findByStatus(status: AppointmentStatus): Promise<IAppointment[]> {
    return this.model
      .find({ status })
      .populate('patientId', 'name email')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .sort({ date: 1 })
      .exec();
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<IAppointment | null> {
    return this.model.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async deleteByParticipant(userId: string): Promise<void> {
    const oid = new Types.ObjectId(userId);
    await this.model.deleteMany({ $or: [{ patientId: oid }, { doctorId: oid }] });
  }
}
