export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  categoryId: string;
  category: Category;
  averageRating: number;
  reviewCount: number;
  publishedYear: number;
  pages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bookCount: number;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  bookId: string;
  book?: Book;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  reviewCount: number;
  favoriteBooks: string[];
  joinedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  role: string;
}
