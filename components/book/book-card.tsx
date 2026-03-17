'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import type { Book } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './rating-stars';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30',
        className
      )}
    >
      {/* Book Cover */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Badge */}
        <Badge
          className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur-sm"
        >
          {book.category.name}
        </Badge>
      </div>

      {/* Book Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          by {book.author}
        </p>

        {/* Rating and Reviews */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <RatingStars rating={book.averageRating} size="sm" showValue />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{book.reviewCount}</span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/20" />
      </div>
    </Link>
  );
}
