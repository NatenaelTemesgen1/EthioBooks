import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title required'),
  author: z.string().min(1, 'Author required'),
  description: z.string(),
  categoryId: z.string().min(1, 'Category required'),
  coverImage: z.string().optional(),
  fileUrl: z.string().optional(),
  publishedYear: z.coerce.number().int().min(1).max(2100).optional(),
  pages: z.coerce.number().int().min(1).optional(),
});

export const updateBookSchema = createBookSchema.partial();

export const createReviewSchema = z.object({
  bookId: z.string().min(1, 'Book required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name required'),
  slug: z.string().optional(),
  icon: z.string().optional(),
});

export const booksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
});

export const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(), // Allow any string (relative path is fine)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
