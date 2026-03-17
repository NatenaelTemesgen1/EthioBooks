import { Request, Response } from 'express';
import * as bookService from '../services/bookService';
import { asyncHandler } from '../utils/asyncHandler';

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const result = await bookService.getBooks(req.query as bookService.BooksQuery);
  res.json(result);
});

export const getPopularBooks = asyncHandler(async (_req: Request, res: Response) => {
  const result = await bookService.getPopularBooks();
  res.json(result);
});

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const book = await bookService.getBookById(req.params.id);
  res.json(book);
});

export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.json(book);
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  await bookService.deleteBook(req.params.id);
  res.json({ success: true });
});

export const getFavoriteStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const bookId = req.params.id;
  const isFavorite = await bookService.isFavorite(userId, bookId);
  res.json({ isFavorite });
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const bookId = req.params.id;
  await bookService.addFavorite(userId, bookId);
  res.status(201).json({ success: true });
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const bookId = req.params.id;
  await bookService.removeFavorite(userId, bookId);
  res.json({ success: true });
});
