import bcrypt from 'bcryptjs';
import { IAuthService, RegisterDTO, LoginDTO, AuthResponse } from '../interfaces/IServices';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { ApiError } from '../utils/ApiError';
import { signToken, verifyToken } from '../utils/jwt.utils';
import { JwtPayload } from 'jsonwebtoken';

/**
 * AuthService — SRP: handles only authentication logic.
 * DI: depends on IRepository abstractions injected via constructor.
 */
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly doctorRepo: DoctorRepository
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

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id.toString()),
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

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user._id.toString()),
    };
  }

  async verifyToken(token: string): Promise<JwtPayload & { id: string }> {
    return verifyToken(token);
  }
}
