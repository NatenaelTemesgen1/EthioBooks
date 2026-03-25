import { Request, Response } from 'express';
import * as authService from '../services/authService';
import * as userService from '../services/userService';  // ← ADD THIS

import { asyncHandler } from '../utils/asyncHandler';
import { accessTokenCookieOptions, clearAuthCookies } from '../utils/cookies';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.register(name, email, password);
  res.cookie('access_token', result.token, accessTokenCookieOptions());
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.cookie('access_token', result.token, accessTokenCookieOptions());
  res.json(result);
});

// ✅ FIXED: Return full user data from database, not just JWT payload
export const me = asyncHandler(async (req: Request, res: Response) => {
  // Get user ID from authenticated token
  const userId = req.user!.userId;
  
  // Fetch full user data from database (includes avatar)
  const user = await userService.getUserById(userId);
  
  res.json({ user });
});


export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ success: true });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  // Always 200 to avoid account enumeration
  res.json(result);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.json({ success: true });
});
