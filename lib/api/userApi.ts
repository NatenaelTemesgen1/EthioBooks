import { apiRequest } from './client';
import type { User } from '@/lib/types';

export function getUserById(id: string): Promise<User> {
  return apiRequest<User>(`/users/${id}`);
}

export function getUsers(): Promise<User[]> {
  return apiRequest<User[]>('/users');
}

export function getMyFavorites(): Promise<any[]> {
  return apiRequest<any[]>('/users/me/favorites');
}

export function getMeProfile(): Promise<User> {
  return apiRequest<User>('/users/me');
}

export function updateMeProfile(data: { name?: string; email?: string; avatar?: string }): Promise<User> {
  return apiRequest<User>('/users/me', { method: 'PUT', body: JSON.stringify(data) });
}
