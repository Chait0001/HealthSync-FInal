import { Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specialization: string;
  experience: number;
  feesPerConsultation: number;
  department: string;
  bio?: string;
  createdAt: Date;
}

export interface UpdateDoctorDTO {
  specialization?: string;
  experience?: number;
  feesPerConsultation?: number;
  department?: string;
  bio?: string;
}
