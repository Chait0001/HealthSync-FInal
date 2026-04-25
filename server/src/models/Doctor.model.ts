import mongoose, { Schema, Types } from 'mongoose';
import { IDoctor } from '../interfaces/IDoctor';

const doctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: [true, 'Please add specialization'] },
  experience: { type: Number, required: [true, 'Please add experience years'] },
  feesPerConsultation: { type: Number, required: [true, 'Please add consultation fees'] },
  department: { type: String, required: [true, 'Please add department'] },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const DoctorModel = mongoose.model<IDoctor>('Doctor', doctorSchema);
