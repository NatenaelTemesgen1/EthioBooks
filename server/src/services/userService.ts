import { prisma } from '../prisma';
import { ApiError } from '../utils/ApiError';

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!user) throw new ApiError('User not found', 404);

  const reviewCount = await prisma.review.count({ where: { userId: id } });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? '',
    role: user.role.name as 'admin' | 'user',
    reviewCount,
    favoriteBooks: [] as string[],
    joinedAt: user.createdAt.toISOString().split('T')[0],
  };
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'desc' },
  });
  const reviewCounts = await prisma.review.groupBy({
    by: ['userId'],
    _count: { _all: true },
  });
  const countByUser = new Map(reviewCounts.map((r) => [r.userId, r._count._all]));

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar ?? '',
    role: u.role.name as 'admin' | 'user',
    reviewCount: countByUser.get(u.id) ?? 0,
    favoriteBooks: [] as string[],
    joinedAt: u.createdAt.toISOString().split('T')[0],
  }));
}

export async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { book: { include: { category: true } } },
    orderBy: { id: 'desc' },
  });

  // Reuse book response shape from bookService? Keep minimal mapping consistent with frontend `Book` type.
  const bookIds = favorites.map((f) => f.bookId);
  const [ratingAggs, reviewCounts] = await Promise.all([
    prisma.review.groupBy({
      by: ['bookId'],
      where: { bookId: { in: bookIds } },
      _avg: { rating: true },
    }),
    prisma.review.groupBy({
      by: ['bookId'],
      where: { bookId: { in: bookIds } },
      _count: { _all: true },
    }),
  ]);
  const avgByBook = new Map(ratingAggs.map((r) => [r.bookId, r._avg.rating ?? 0]));
  const countByBook = new Map(reviewCounts.map((r) => [r.bookId, r._count._all]));

  return favorites.map((f) => ({
    id: f.book.id,
    title: f.book.title,
    author: f.book.author,
    description: f.book.description,
    coverImage: f.book.coverImage ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    categoryId: f.book.categoryId,
    category: {
      id: f.book.category.id,
      name: f.book.category.name,
      slug: f.book.category.slug,
      icon: f.book.category.icon ?? 'BookOpen',
      bookCount: 0,
    },
    averageRating: avgByBook.get(f.bookId) ?? 0,
    reviewCount: countByBook.get(f.bookId) ?? 0,
    publishedYear: f.book.publishedYear ?? 0,
    pages: f.book.pages ?? 0,
  }));
}

export async function updateMe(userId: string, data: { name?: string; email?: string; avatar?: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  if (!user) throw new ApiError('User not found', 404);

  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError('Email already in use', 400);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name != null && { name: data.name }),
      ...(data.email != null && { email: data.email }),
      ...(data.avatar !== undefined && { avatar: data.avatar || null }),
    },
    include: { role: true },
  });

  const reviewCount = await prisma.review.count({ where: { userId } });
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    avatar: updated.avatar ?? '',
    role: updated.role.name as 'admin' | 'user',
    reviewCount,
    favoriteBooks: [] as string[],
    joinedAt: updated.createdAt.toISOString().split('T')[0],
  };
}
