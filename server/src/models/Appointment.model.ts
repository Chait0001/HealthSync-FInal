import mongoose, { Schema } from 'mongoose';
import { IAppointment } from '../interfaces/IAppointment';

const appointmentSchema = new Schema<IAppointment>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: [true, 'Please add appointment date'] },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending',
  },
  reason: { type: String, required: [true, 'Please add reason for appointment'] },
  createdAt: { type: Date, default: Date.now },
});

export const AppointmentModel = mongoose.model<IAppointment>('Appointment', appointmentSchema);
