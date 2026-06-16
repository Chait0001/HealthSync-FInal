import mongoose, { Schema, Types } from 'mongoose';
import { IDoctor } from '../interfaces/IDoctor';

const doctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: [true, 'Please add specialization'] },
  experience: { type: Number, required: [true, 'Please add experience years'] },
  feesPerConsultation: { type: Number, required: [true, 'Please add consultation fees'] },
  department: { type: String, required: [true, 'Please add department'] },
  bio: { type: String },
  designation: { type: String },
  hospitalName: { type: String },
  opdTimings: { type: String },
  profilePicture: { type: String },
  workExperience: [{
    role: { type: String, required: true },
    organization: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true }
  }],
  specialityInterests: [{ type: String }],
  memberships: [{ type: String }],
  awards: [{
    name: { type: String, required: true },
    year: { type: String, required: true }
  }],
  publications: [{
    title: { type: String, required: true },
    journalName: { type: String, required: true }
  }],
  languages: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const DoctorModel = mongoose.model<IDoctor>('Doctor', doctorSchema);
