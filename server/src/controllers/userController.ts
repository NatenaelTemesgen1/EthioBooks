import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
});

export const getMyFavorites = asyncHandler(async (req: Request, res: Response) => {
  const items = await userService.getFavorites(req.user!.userId);
  res.json(items);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user!.userId);
  res.json(user);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(req.user!.userId, req.body);
  res.json(user);
});
