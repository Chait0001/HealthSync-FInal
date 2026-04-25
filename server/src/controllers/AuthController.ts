import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * AuthController — SRP: only translates HTTP ↔ service calls.
 * DIP: depends on IAuthService interface, not a concrete class.
 */
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(ApiResponse.success(result, 'Registration successful', 201));
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json(ApiResponse.success(result, 'Login successful'));
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(ApiResponse.success(req.user, 'User retrieved'));
    } catch (err) {
      next(err);
    }
  };
}
