import bcrypt from 'bcryptjs';
import { IAuthService, RegisterDTO, LoginDTO, AuthResponse } from '../interfaces/IServices';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { RoleService } from './RoleService';
import { ApiError } from '../utils/ApiError';
import { signToken, verifyToken } from '../utils/jwt.utils';
import { JwtPayload } from 'jsonwebtoken';
import { RoleModel } from '../models/Role.model';

/**
 * AuthService — SRP: handles only authentication logic.
 * DI: depends on IRepository abstractions injected via constructor.
 */
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly doctorRepo: DoctorRepository,
    private readonly roleService: RoleService
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const { name, email, password, role = 'patient', ...otherDetails } = data;

    if (!name || !email || !password) {
      throw new ApiError('Please provide name, email and password', 400);
    }

    const userExists = await this.userRepo.findByEmail(email);
    if (userExists) {
      throw new ApiError('User already exists', 400);
    }

    const user = await this.userRepo.create({
      name,
      email,
      password,
      role,
      ...otherDetails,
    } as any);

    // Assign role and refresh permissions cache
    const permissions = await this.roleService.assignRoleToUser(user._id.toString(), role, 'system');
    user.permissions_cache = permissions;

    // If doctor, create doctor profile
    if (role === 'doctor') {
      await this.doctorRepo.create({
        userId: user._id,
        specialization: otherDetails.specialization,
        experience: otherDetails.experience,
        feesPerConsultation: otherDetails.feesPerConsultation,
        department: otherDetails.department,
        bio: otherDetails.bio,
      } as any);
    }

    let roleId = '';
    if (user.roles && user.roles.length > 0) {
      roleId = user.roles[0].role_id.toString();
    } else {
      const roleDoc = await RoleModel.findOne({ key: user.role });
      if (roleDoc) roleId = roleDoc._id.toString();
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      roleId,
      token: signToken(user._id.toString()),
      permissions_cache: user.permissions_cache ?? [],
      phone: user.phone || '',
      age: user.age,
      gender: user.gender || '',
      address: user.address || '',
      bloodGroup: user.bloodGroup || '',
      createdAt: user.createdAt,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepo.findByEmail(email, true);
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    let roleId = '';
    if (user.roles && user.roles.length > 0) {
      roleId = user.roles[0].role_id.toString();
    } else {
      const roleDoc = await RoleModel.findOne({ key: user.role });
      if (roleDoc) roleId = roleDoc._id.toString();
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      roleId,
      token: signToken(user._id.toString()),
      permissions_cache: user.permissions_cache ?? [],
      phone: user.phone || '',
      age: user.age,
      gender: user.gender || '',
      address: user.address || '',
      bloodGroup: user.bloodGroup || '',
      createdAt: user.createdAt,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload & { id: string }> {
    return verifyToken(token);
  }

  async updateProfile(userId: string, data: { phone?: string; age?: number; gender?: string; address?: string; bloodGroup?: string }) {
    const allowed = ['phone', 'age', 'gender', 'address', 'bloodGroup'];
    const update: any = {};
    for (const key of allowed) {
      if (data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== '') {
        update[key] = data[key as keyof typeof data];
      }
    }
    return this.userRepo.updateProfile(userId, update);
  }
}
