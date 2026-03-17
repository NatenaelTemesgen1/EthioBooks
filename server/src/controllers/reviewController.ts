import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';
import { asyncHandler } from '../utils/asyncHandler';

export const getReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await reviewService.getReviews();
  res.json(reviews);
});

export const getLatestReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await reviewService.getLatestReviews();
  res.json(reviews);
});

export const getReviewsByBookId = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getReviewsByBookId(req.params.id);
  res.json(reviews);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const review = await reviewService.createReview(userId, req.body);
  res.status(201).json(review);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const review = await reviewService.updateReview(req.params.id, userId, req.body);
  res.json(review);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await reviewService.deleteReview(req.params.id, userId, req.user!.role);
  res.json({ success: true });
});
