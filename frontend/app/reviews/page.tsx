import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ReviewCard } from '@/components/review/review-card';
import { Button } from '@/components/ui/button';
import { getLatestReviews } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const reviews = await getLatestReviews();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Reviews</h1>
              <p className="mt-2 text-muted-foreground">Latest reviews from the community</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showBookInfo />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

