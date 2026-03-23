import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { ACCESS_TOKEN_COOKIE } from '../utils/cookies';

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const cookieToken = (req as any).cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined;
  const token = bearer ?? cookieToken ?? null;

  if (!token) {
    next(new ApiError('Please Sign In Or Create An Account', 401));
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new ApiError('Invalid or expired token', 401));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new ApiError('Authentication required', 401));
    return;
  }
  if (req.user.role !== 'admin') {
    next(new ApiError('Admin access required', 403));
    return;
  }
  next();
}
