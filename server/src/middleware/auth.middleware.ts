import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { verifyToken } from '../utils/jwt.utils';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../interfaces/IUser';

// Extend Express Request to carry authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}

const userRepo = new UserRepository();

/**
 * authenticate — JWT verification middleware (SRP: only verifies tokens)
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError('Not authorized, no token', 401));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await userRepo.findById(decoded.id);
    if (!user) return next(new ApiError('User not found', 401));
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError('Not authorized', 401));
  }
};
