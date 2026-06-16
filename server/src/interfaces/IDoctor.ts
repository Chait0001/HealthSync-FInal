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
  // New Profile Fields
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  profilePicture?: string;
  workExperience?: Array<{ role: string; organization: string; duration: string }>;
  education?: Array<{ degree: string; institution: string; year: string }>;
  specialityInterests?: string[];
  memberships?: string[];
  awards?: Array<{ name: string; year: string }>;
  publications?: Array<{ title: string; journalName: string }>;
  languages?: string[];
}

export interface UpdateDoctorDTO {
  name?: string; // name in UserModel
  specialization?: string;
  experience?: number;
  feesPerConsultation?: number;
  department?: string;
  bio?: string;
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  profilePicture?: string;
  workExperience?: Array<{ role: string; organization: string; duration: string }>;
  education?: Array<{ degree: string; institution: string; year: string }>;
  specialityInterests?: string[];
  memberships?: string[];
  awards?: Array<{ name: string; year: string }>;
  publications?: Array<{ title: string; journalName: string }>;
  languages?: string[];
}
