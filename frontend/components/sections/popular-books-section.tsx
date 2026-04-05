import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BookCard } from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { getPopularBooks } from '@/lib/api';

export async function PopularBooksSection() {
  const popularBooks = await getPopularBooks();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Popular Books
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover what readers are loving right now
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-4 sm:mt-0 group">
            <Link href="/books" className="flex items-center gap-2">
              View All Books
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Book Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularBooks.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
