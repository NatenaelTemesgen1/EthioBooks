import { prisma } from '../prisma';
import { ApiError } from '../utils/ApiError';

export async function getReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { include: { role: true } },
      book: { include: { category: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return reviews.map((r) => toReviewResponse(r as any));
}

export async function getLatestReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { include: { role: true } },
      book: { include: { category: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return reviews.map((r) => toReviewResponse(r as any));
}

export async function getReviewsByBookId(bookId: string) {
  const reviews = await prisma.review.findMany({
    where: { bookId },
    include: { user: { include: { role: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return reviews.map(toReviewResponse);
}

export async function createReview(userId: string, data: { bookId: string; rating: number; comment: string }) {
  if (data.rating < 1 || data.rating > 5) throw new ApiError('Rating must be between 1 and 5', 400);

  const book = await prisma.book.findUnique({ where: { id: data.bookId } });
  if (!book) throw new ApiError('Book not found', 404);

  const existing = await prisma.review.findFirst({
    where: { userId, bookId: data.bookId },
  });
  if (existing) throw new ApiError('You have already reviewed this book', 400);

  const review = await prisma.review.create({
    data: {
      userId,
      bookId: data.bookId,
      rating: data.rating,
      comment: data.comment.trim() || 'No comment',
    },
    include: { user: { include: { role: true } }, book: true },
  });
  return toReviewResponse(review);
}

export async function updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new ApiError('Review not found', 404);
  if (review.userId !== userId) throw new ApiError('Forbidden', 403);

  if (data.rating != null && (data.rating < 1 || data.rating > 5)) {
    throw new ApiError('Rating must be between 1 and 5', 400);
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(data.rating != null && { rating: data.rating }),
      ...(data.comment != null && { comment: data.comment }),
    },
    include: { user: { include: { role: true } }, book: true },
  });
  return toReviewResponse(updated);
}

export async function deleteReview(reviewId: string, userId: string, role?: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new ApiError('Review not found', 404);
  if (review.userId !== userId && role !== 'admin') throw new ApiError('Forbidden', 403);

  await prisma.review.delete({ where: { id: reviewId } });
  return { success: true };
}

function toReviewResponse(review: {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: Date;
  user: { id: string; name: string; email: string; avatar: string | null; role: { name: string } };
  book?: { id: string; title: string; author: string; description: string; coverImage: string | null; categoryId: string; category?: { id: string; name: string; slug: string } };
}) {
  return {
    id: review.id,
    userId: review.userId,
    user: {
      id: review.user.id,
      name: review.user.name,
      email: review.user.email,
      avatar: review.user.avatar ?? '',
      role: review.user.role.name,
      reviewCount: 0,
      favoriteBooks: [],
      joinedAt: '',
    },
    bookId: review.bookId,
    ...(review.book && {
      book: {
        id: review.book.id,
        title: review.book.title,
        author: review.book.author,
        description: review.book.description,
        coverImage: review.book.coverImage ?? '',
        categoryId: review.book.categoryId,
        category: review.book.category
          ? { id: review.book.category.id, name: review.book.category.name, slug: review.book.category.slug, icon: 'BookOpen', bookCount: 0 }
          : (undefined as any),
        averageRating: 0,
        reviewCount: 0,
        publishedYear: 0,
        pages: 0,
      },
    }),
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    helpful: review.helpful,
  };
}
