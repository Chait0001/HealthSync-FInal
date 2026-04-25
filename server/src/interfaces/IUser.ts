import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
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
  role?: 'patient' | 'doctor' | 'admin';
  // Patient extras
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  // Doctor extras
  specialization?: string;
  experience?: number;
  feesPerConsultation?: number;
  department?: string;
  bio?: string;
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
  token: string;
}
