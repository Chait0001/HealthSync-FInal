"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = require("../utils/ApiError");
const jwt_utils_1 = require("../utils/jwt.utils");
/**
 * AuthService — SRP: handles only authentication logic.
 * DI: depends on IRepository abstractions injected via constructor.
 */
class AuthService {
    constructor(userRepo, doctorRepo) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }
    async register(data) {
        const { name, email, password, role = 'patient', ...otherDetails } = data;
        if (!name || !email || !password) {
            throw new ApiError_1.ApiError('Please provide name, email and password', 400);
        }
        const userExists = await this.userRepo.findByEmail(email);
        if (userExists) {
            throw new ApiError_1.ApiError('User already exists', 400);
        }
        const user = await this.userRepo.create({
            name,
            email,
            password,
            role,
            ...otherDetails,
        });
        // If doctor, create doctor profile
        if (role === 'doctor') {
            await this.doctorRepo.create({
                userId: user._id,
                specialization: otherDetails.specialization,
                experience: otherDetails.experience,
                feesPerConsultation: otherDetails.feesPerConsultation,
                department: otherDetails.department,
                bio: otherDetails.bio,
            });
        }
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, jwt_utils_1.signToken)(user._id.toString()),
        };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.userRepo.findByEmail(email, true);
        if (!user) {
            throw new ApiError_1.ApiError('Invalid email or password', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError('Invalid email or password', 401);
        }
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, jwt_utils_1.signToken)(user._id.toString()),
        };
    }
    async verifyToken(token) {
        return (0, jwt_utils_1.verifyToken)(token);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map