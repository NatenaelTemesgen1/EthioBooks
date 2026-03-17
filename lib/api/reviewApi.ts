import { apiRequest } from './client';
import type { Review } from '@/lib/types';

export function getReviewsByBookId(bookId: string): Promise<Review[]> {
  return apiRequest<Review[]>(`/books/${bookId}/reviews`);
}

export function getReviews(): Promise<Review[]> {
  return apiRequest<Review[]>('/reviews');
}

export function getLatestReviews(): Promise<Review[]> {
  return apiRequest<Review[]>('/reviews/latest');
}

export interface CreateReviewInput {
  bookId: string;
  rating: number;
  comment: string;
}

export function createReview(data: CreateReviewInput): Promise<Review> {
  return apiRequest<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReview(
  id: string,
  data: { rating?: number; comment?: string }
): Promise<Review> {
  return apiRequest<Review>(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteReview(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' });
}
