import { Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specialization?: string;           // Legacy single-string, kept for backward compat
  specialities?: string[];           // New multi-speciality array
  experience: number;
  feesPerConsultation: number;
  department: string;
  bio?: string;
  createdAt: Date;
  // Profile Fields
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  opdSchedule?: Array<{ day?: string; startTime?: string; endTime?: string }>;
  profilePhoto?: string;
  workExperience?: Array<{ role?: string; organization?: string; duration?: string }>;
  education?: Array<{ degree?: string; institution?: string; year?: string }>;
  specialityInterests?: string[];
  memberships?: string[];
  awards?: Array<{ name?: string; title?: string; year?: string; description?: string }>;
  publications?: Array<{ title?: string; journalName?: string; year?: string; url?: string }>;
  languagesSpoken?: string[];
}

export interface UpdateDoctorDTO {
  name?: string; // name in UserModel
  specialization?: string;
  specialities?: string[];
  experience?: number;
  feesPerConsultation?: number;
  department?: string;
  bio?: string;
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  opdSchedule?: Array<{ day?: string; startTime?: string; endTime?: string }>;
  profilePhoto?: string;
  workExperience?: Array<{ role?: string; organization?: string; duration?: string }>;
  education?: Array<{ degree?: string; institution?: string; year?: string }>;
  specialityInterests?: string[];
  memberships?: string[];
  awards?: Array<{ name?: string; title?: string; year?: string; description?: string }>;
  publications?: Array<{ title?: string; journalName?: string; year?: string; url?: string }>;
  languagesSpoken?: string[];
}
