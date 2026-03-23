import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Share2, BookOpen, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/book/book-card';
import { ReviewCard } from '@/components/review/review-card';
import { ReviewForm } from '@/components/review/review-form';
import { FavoriteButton } from '@/components/book/favorite-button';
import { RatingStars } from '@/components/book/rating-stars';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Book, Review } from '@/lib/types';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

async function fetchBook(id: string): Promise<Book | null> {
  const res = await fetch(`${API_BASE}/books/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function fetchReviews(bookId: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/books/${bookId}/reviews`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function fetchBooksByCategory(categoryId: string, excludeId: string): Promise<Book[]> {
  const res = await fetch(`${API_BASE}/books?categoryId=${categoryId}&limit=5`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).filter((b: Book) => b.id !== excludeId).slice(0, 4);
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await fetchBook(id);
  if (!book) {
    notFound();
  }
  const [bookReviews, related] = await Promise.all([
    fetchReviews(id),
    fetchBooksByCategory(book.categoryId, id),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/books" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Books
            </Link>
          </Button>

          {/* Book Details */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="aspect-2/3 w-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <FavoriteButton bookId={book.id} />
                  {book.fileUrl ? (
                    <>
                      <Button asChild variant="secondary">
                        <a href={book.fileUrl} target="_blank" rel="noreferrer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read
                        </a>
                      </Button>
                      <Button asChild variant="outline">
                        <a href={book.fileUrl} download>
                          Download
                        </a>
                      </Button>
                    </>
                  ) : null}
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div>
                <Badge variant="secondary" className="mb-4">
                  {book.category.name}
                </Badge>
                <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  by <span className="font-medium text-foreground">{book.author}</span>
                </p>

                {/* Rating Summary */}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <RatingStars rating={book.averageRating} size="md" showValue />
                  <span className="text-sm text-muted-foreground">
                    ({book.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Book Metadata */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published</p>
                    <p className="font-medium text-foreground">{book.publishedYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pages</p>
                    <p className="font-medium text-foreground">{book.pages}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">{book.category.name}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Description */}
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  About This Book
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
{/* this is the preview for the books */}
              {/* {book.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                <>
                  <Separator className="my-8" />
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-foreground">Preview</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You can preview this PDF directly here.
                    </p>
                    <iframe
                      src={book.fileUrl}
                      title={`${book.title} preview`}
                      className="mt-4 h-[640px] w-full rounded-xl border border-border"
                    />
                  </div>
                </>
              ) : null}

              <Separator className="my-8" /> */}

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Reviews
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {bookReviews.length} {bookReviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>

                {/* Review Form */}
                <div className="mt-6">
                  <ReviewForm bookId={book.id} />
                </div>

                {/* Reviews List */}
                {bookReviews.length > 0 ? (
                  <div className="mt-8 space-y-6">
                    {bookReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      No reviews yet. Be the first to review this book!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Books */}
          {related.length > 0 && (
            <div className="mt-16">
              <Separator className="mb-8" />
              <h2 className="font-serif text-2xl font-bold text-foreground">
                You May Also Like
              </h2>
              <p className="mt-2 text-muted-foreground">
                More books in {book.category.name}
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((relatedBook) => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
