import type { CookieOptions, Response } from 'express';
import { env, isProd } from '../config/env';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const XSRF_COOKIE = 'XSRF-TOKEN';

export function accessTokenCookieOptions(): CookieOptions {
  // In production behind HTTPS, set COOKIE_SECURE=true.
  const secure = env.COOKIE_SECURE || isProd();
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function xsrfCookieOptions(): CookieOptions {
  const secure = env.COOKIE_SECURE || isProd();
  return {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  res.clearCookie(XSRF_COOKIE, { path: '/' });
}

