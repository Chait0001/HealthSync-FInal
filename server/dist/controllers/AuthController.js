"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
/**
 * AuthController — SRP: only translates HTTP ↔ service calls.
 * DIP: depends on IAuthService interface, not a concrete class.
 */
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.register = async (req, res, next) => {
            try {
                const result = await this.authService.register(req.body);
                res.status(201).json(ApiResponse_1.ApiResponse.success(result, 'Registration successful', 201));
            }
            catch (err) {
                next(err);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                res.status(200).json(ApiResponse_1.ApiResponse.success(result, 'Login successful'));
            }
            catch (err) {
                next(err);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                res.status(200).json(ApiResponse_1.ApiResponse.success(req.user, 'User retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map