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
    role: 'patient' | 'doctor' | 'admin';
    roles?: IUserRole[];
    permissions_cache?: string[];
    department_id?: Types.ObjectId;
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
    age?: number;
    gender?: string;
    phone?: string;
    address?: string;
    bloodGroup?: string;
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
//# sourceMappingURL=IUser.d.ts.map