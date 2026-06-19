import { Document, Types } from 'mongoose';

export interface IUserRole {
  role_id: Types.ObjectId;
  role_key?: string;
  role_name?: string;
  is_primary?: boolean;
  assigned_at?: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string; // open — supports custom roles beyond patient/doctor/admin
  roles?: IUserRole[];
  permissions_cache?: string[];
  department_id?: Types.ObjectId;
  // Patient fields
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  phone?: string;
  address?: string;
  bloodGroup?: string;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: string; // supports custom roles
  // Patient extras
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  // Doctor extras
  specialization?: string;
  specialities?: string[];
  experience?: number;
  feesPerConsultation?: number;
  department?: string;
  bio?: string;
  languagesSpoken?: string[];
  memberships?: string[];
  profilePhoto?: string;
  workExperience?: any[];
  education?: any[];
  awards?: any[];
  publications?: any[];
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  opdSchedule?: Array<{ day: string; startTime: string; endTime: string }>;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  token: string;
  permissions_cache: string[];
  phone?: string;
  age?: number;
  gender?: string;
  address?: string;
  bloodGroup?: string;
  createdAt?: Date;
}
