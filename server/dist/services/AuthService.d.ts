import { IAuthService, RegisterDTO, LoginDTO, AuthResponse } from '../interfaces/IServices';
import { UserRepository } from '../repositories/UserRepository';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { JwtPayload } from 'jsonwebtoken';
/**
 * AuthService — SRP: handles only authentication logic.
 * DI: depends on IRepository abstractions injected via constructor.
 */
export declare class AuthService implements IAuthService {
    private readonly userRepo;
    private readonly doctorRepo;
    constructor(userRepo: UserRepository, doctorRepo: DoctorRepository);
    register(data: RegisterDTO): Promise<AuthResponse>;
    login(data: LoginDTO): Promise<AuthResponse>;
    verifyToken(token: string): Promise<JwtPayload & {
        id: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map