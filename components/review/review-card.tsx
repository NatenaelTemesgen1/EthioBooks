import Link from 'next/link';
import { ThumbsUp } from 'lucide-react';
import type { Review } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RatingStars } from '@/components/book/rating-stars';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  showBookInfo?: boolean;
  className?: string;
}

export function ReviewCard({ review, showBookInfo = false, className }: ReviewCardProps) {
  const initials = review.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-border/80 hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border-2 border-accent/20">
          <AvatarImage src={review.user.avatar} alt={review.user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{review.user.name}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <RatingStars rating={review.rating} size="sm" className="mt-1" />
        </div>
      </div>

      {/* Book Info (optional) */}
      {showBookInfo && review.book && (
        <Link
          href={`/books/${review.book.id}`}
          className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
        >
          <img
            src={review.book.coverImage}
            alt={review.book.title}
            className="h-14 w-10 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="font-serif font-medium text-foreground line-clamp-1">
              {review.book.title}
            </p>
            <p className="text-sm text-muted-foreground">by {review.book.author}</p>
          </div>
        </Link>
      )}

      {/* Comment */}
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-4">
        {review.comment}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-4 pt-2 border-t border-border">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpful})</span>
        </button>
      </div>
    </div>
  );
}
