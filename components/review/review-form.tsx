'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RatingStars } from '@/components/book/rating-stars';
import { createReview } from '@/lib/api';

interface ReviewFormProps {
  bookId: string;
  onSubmit?: (data: { rating: number; comment: string }) => void;
}

export function ReviewForm({ bookId, onSubmit }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createReview({ bookId, rating, comment });
      onSubmit?.({ rating, comment });
      setSubmitted(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review. Sign in and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
          Thank you for your review!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your review has been submitted and will be visible shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-serif text-lg font-semibold text-foreground">
        Write a Review
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your thoughts about this book
      </p>

      {/* Rating */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-foreground">
          Your Rating
        </label>
        <div className="mt-2">
          <RatingStars
            rating={rating}
            size="lg"
            interactive
            onRatingChange={setRating}
          />
        </div>
        {rating === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Click the stars to rate
          </p>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      {/* Comment */}
      <div className="mt-6">
        <label htmlFor="comment" className="block text-sm font-medium text-foreground">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think about this book?"
          className="mt-2 min-h-[120px] resize-none"
        />
      </div>

      {/* Submit */}
      <div className="mt-6">
        <Button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Review
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
