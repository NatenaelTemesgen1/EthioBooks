import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import { asyncHandler } from '../utils/asyncHandler';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  res.json(categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.json(category);
});

export const getBooksByCategoryId = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.getBooksByCategoryId(req.params.id, req.query as any);
  res.json(result);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ success: true });
});
