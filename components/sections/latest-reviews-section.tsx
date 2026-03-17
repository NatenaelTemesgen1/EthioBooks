import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ReviewCard } from '@/components/review/review-card';
import { Button } from '@/components/ui/button';
import { getLatestReviews } from '@/lib/api';

export async function LatestReviewsSection() {
  const latestReviews = await getLatestReviews();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Latest Reviews
            </h2>
            <p className="mt-2 text-muted-foreground">
              See what the community is saying
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-4 sm:mt-0 group">
            <Link href="/reviews" className="flex items-center gap-2">
              View All Reviews
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestReviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} showBookInfo />
          ))}
        </div>
      </div>
    </section>
  );
}
