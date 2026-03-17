import type { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError';
import { ACCESS_TOKEN_COOKIE, XSRF_COOKIE, xsrfCookieOptions } from '../utils/cookies';

export function ensureXsrfCookie(req: Request, res: Response, next: NextFunction) {
  const existing = req.cookies?.[XSRF_COOKIE];
  if (!existing) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie(XSRF_COOKIE, token, xsrfCookieOptions());
  }
  next();
}

// Double-submit cookie CSRF protection for cookie-authenticated requests.
// If Authorization: Bearer <token> is used, we allow it without CSRF header.
export function requireCsrfForCookieAuth(req: Request, _res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  const isSafeMethod = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  if (isSafeMethod) return next();

  const authHeader = req.headers.authorization;
  const usingBearer = !!(authHeader && authHeader.startsWith('Bearer '));
  if (usingBearer) return next();

  const hasAccessCookie = !!req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (!hasAccessCookie) return next();

  const cookieToken = req.cookies?.[XSRF_COOKIE];
  const headerToken = req.headers['x-xsrf-token'];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new ApiError('CSRF token missing or invalid', 403));
  }
  next();
}

