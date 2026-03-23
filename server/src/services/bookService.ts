import { prisma } from '../prisma';
import { ApiError } from '../utils/ApiError';

export interface BooksQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export async function getBooks(query: BooksQuery) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(50, Math.max(1, query.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.search && query.search.trim()) {
    where.OR = [
      { title: { contains: query.search.trim(), mode: 'insensitive' } },
      { author: { contains: query.search.trim(), mode: 'insensitive' } },
    ];
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { category: true },
      orderBy: { title: 'asc' },
      skip,
      take: limit,
    }),
    prisma.book.count({ where }),
  ]);

  const bookIds = books.map((b) => b.id);
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

  const items = books.map((b) =>
    toBookResponse(b, avgByBook.get(b.id) ?? 0, countByBook.get(b.id) ?? 0)
  );
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPopularBooks() {
  const books = await prisma.book.findMany({
    include: { category: true },
    take: 24,
    orderBy: { title: 'asc' },
  });

  const bookIds = books.map((b) => b.id);
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

  return books
    .map((b) => toBookResponse(b, avgByBook.get(b.id) ?? 0, countByBook.get(b.id) ?? 0))
    .sort((a, b) => (b.averageRating - a.averageRating) || (b.reviewCount - a.reviewCount))
    .slice(0, 8);
}

export async function getBookById(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!book) throw new ApiError('Book not found', 404);

  const [reviewAgg, reviewCount] = await Promise.all([
    prisma.review.aggregate({ where: { bookId: id }, _avg: { rating: true } }),
    prisma.review.count({ where: { bookId: id } }),
  ]);

  return toBookResponse(book, reviewAgg._avg.rating ?? 0, reviewCount);
}

export async function createBook(data: {
  title: string;
  author: string;
  description: string;
  categoryId: string;
  coverImage?: string;
  fileUrl?: string;
  publishedYear?: number;
  pages?: number;
}) {
  const category = await prisma.bookCategory.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new ApiError('Category not found', 400);

  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      description: data.description,
      categoryId: data.categoryId,
      coverImage: data.coverImage ?? null,
      fileUrl: data.fileUrl ?? null,
      publishedYear: data.publishedYear ?? null,
      pages: data.pages ?? null,
    },
    include: { category: true },
  });
  return toBookResponse(book, 0, 0);
}

export async function updateBook(
  id: string,
  data: Partial<{
    title: string;
    author: string;
    description: string;
    categoryId: string;
    coverImage: string;
    fileUrl: string;
    publishedYear: number;
    pages: number;
  }>
) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw new ApiError('Book not found', 404);
  if (data.categoryId) {
    const cat = await prisma.bookCategory.findUnique({ where: { id: data.categoryId } });
    if (!cat) throw new ApiError('Category not found', 400);
  }

  const updated = await prisma.book.update({
    where: { id },
    data: {
      ...(data.title != null && { title: data.title }),
      ...(data.author != null && { author: data.author }),
      ...(data.description != null && { description: data.description }),
      ...(data.categoryId != null && { categoryId: data.categoryId }),
      ...(data.coverImage != null && { coverImage: data.coverImage }),
      ...(data.fileUrl != null && { fileUrl: data.fileUrl }),
      ...(data.publishedYear != null && { publishedYear: data.publishedYear }),
      ...(data.pages != null && { pages: data.pages }),
    },
    include: { category: true },
  });

  const [reviewAgg, reviewCount] = await Promise.all([
    prisma.review.aggregate({ where: { bookId: id }, _avg: { rating: true } }),
    prisma.review.count({ where: { bookId: id } }),
  ]);
  return toBookResponse(updated, reviewAgg._avg.rating ?? 0, reviewCount);
}

export async function deleteBook(id: string) {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw new ApiError('Book not found', 404);
  await prisma.book.delete({ where: { id } });
  return { success: true };
}

export async function isFavorite(userId: string, bookId: string) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
  return !!fav;
}

export async function addFavorite(userId: string, bookId: string) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new ApiError('Book not found', 404);
  await prisma.favorite.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: {},
    create: { userId, bookId },
  });
  return { success: true };
}

export async function removeFavorite(userId: string, bookId: string) {
  await prisma.favorite.deleteMany({
    where: { userId, bookId },
  });
  return { success: true };
}

function toBookResponse(
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string | null;
    fileUrl: string | null;
    publishedYear: number | null;
    pages: number | null;
    categoryId: string;
    category: { id: string; name: string; slug: string };
  },
  averageRating?: number,
  reviewCount?: number
) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverImage ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    fileUrl: book.fileUrl ?? '',
    categoryId: book.categoryId,
    category: {
      id: book.category.id,
      name: book.category.name,
      slug: book.category.slug,
      icon: 'BookOpen',
      bookCount: 0,
    },
    averageRating: averageRating ?? 0,
    reviewCount: reviewCount ?? 0,
    publishedYear: book.publishedYear ?? 0,
    pages: book.pages ?? 0,
  };
}
