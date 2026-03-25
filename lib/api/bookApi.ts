import { apiRequest } from './client';
import type { Book } from '@/lib/types';

export interface BooksParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export interface BooksResponse {
  items: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getBooks(params?: BooksParams): Promise<BooksResponse> {
  const query: Record<string, string> = {};
  if (params?.page != null) query.page = String(params.page);
  if (params?.limit != null) query.limit = String(params.limit);
  if (params?.categoryId) query.categoryId = params.categoryId;
  if (params?.search) query.search = params.search;
  return apiRequest<BooksResponse>('/books', { params: query });
}

export function getBookById(id: string): Promise<Book> {
  return apiRequest<Book>(`/books/${id}`);
}

export function getPopularBooks(): Promise<Book[]> {
  return apiRequest<Book[]>('/books/popular');
}

export function getFavoriteStatus(bookId: string): Promise<{ isFavorite: boolean }> {
  return apiRequest<{ isFavorite: boolean }>(`/books/${bookId}/favorite`);
}

export function addFavorite(bookId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/books/${bookId}/favorite`, { method: 'POST' });
}

export function removeFavorite(bookId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/books/${bookId}/favorite`, { method: 'DELETE' });
}

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  categoryId: string;
  coverImage?: string;
  fileUrl?: string;
  publishedYear?: number;
  pages?: number;
}

export function createBook(data: CreateBookInput): Promise<Book> {
  return apiRequest<Book>('/books', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBook(id: string, data: Partial<CreateBookInput>): Promise<Book> {
  return apiRequest<Book>(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBook(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/books/${id}`, { method: 'DELETE' });
}

