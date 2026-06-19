import mongoose, { Schema, Types } from 'mongoose';
import { IDoctor } from '../interfaces/IDoctor';

const doctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // Legacy single-string specialization — kept for backward compat with seeded/existing doctors
  specialization: { type: String },
  // New multi-speciality array for doctors signed up via the new onboarding flow
  specialities: { type: [String], default: [] },
  experience: { type: Number, required: [true, 'Please add experience years'] },
  feesPerConsultation: { type: Number, required: [true, 'Please add consultation fees'] },
  department: { type: String, required: [true, 'Please add department'] },
  bio: { type: String },
  designation: { type: String },
  hospitalName: { type: String },
  opdTimings: { type: String },
  opdSchedule: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String },
  }],
  profilePhoto: { type: String },
  workExperience: [{
    role: { type: String },
    organization: { type: String },
    duration: { type: String }
  }],
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  specialityInterests: [{ type: String }],
  memberships: [{ type: String }],
  awards: [{
    name: { type: String },
    title: { type: String },
    year: { type: String },
    description: { type: String }
  }],
  publications: [{
    title: { type: String },
    journalName: { type: String },
    year: { type: String },
    url: { type: String }
  }],
  languagesSpoken: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const DoctorModel = mongoose.model<IDoctor>('Doctor', doctorSchema);
