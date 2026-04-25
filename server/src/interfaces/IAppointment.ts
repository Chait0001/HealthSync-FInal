import { Document, Types } from 'mongoose';

export type AppointmentStatus = 'pending' | 'approved' | 'cancelled' | 'completed';

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  status: AppointmentStatus;
  reason: string;
  createdAt: Date;
}

export interface BookAppointmentDTO {
  doctorId: string;
  date: string;
  reason: string;
}
