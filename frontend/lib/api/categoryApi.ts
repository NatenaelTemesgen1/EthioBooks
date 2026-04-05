import { apiRequest } from './client';
import type { Category } from '@/lib/types';

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories');
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  icon?: string;
}

export function createCategory(data: CreateCategoryInput): Promise<Category> {
  return apiRequest<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(id: string, data: Partial<CreateCategoryInput>): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' });
}
