import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { ApiError } from './ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';
const JWT_EXPIRES_IN = '30d';

export const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload & { id: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string };
  } catch {
    throw new ApiError('Invalid or expired token', 401);
  }
};
