import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReviewCard } from "@/components/review/review-card";
import { Button } from "@/components/ui/button";
import { getLatestReviews } from "@/lib/api";

export async function LatestReviewsSection() {
  const latestReviews = await getLatestReviews();

  return (
    <section className="relative py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-20 bottom-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">

          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Latest <span className="text-emerald-500">Reviews</span>
            </h2>

            <p className="mt-3 text-muted-foreground">
              See what the community is saying about their recent reads.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
  <Button
    variant="ghost"
    asChild
    className="group mt-6 sm:mt-0 sm:ml-auto rounded-full px-5"
  >
    <Link href="/reviews" className="flex items-center gap-2">
      View All Reviews
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </Button>
</div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {latestReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="transition-all duration-300 hover:-translate-y-1"
            >
              <ReviewCard review={review} showBookInfo />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}