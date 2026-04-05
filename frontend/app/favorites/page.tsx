'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { getMyFavorites } from '@/lib/api';
import type { Book } from '@/lib/types';

export default function FavoritesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyFavorites()
      .then((items) => {
        if (cancelled) return;
        setBooks(items);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load favorites');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Favorites</h1>
              <p className="mt-2 text-muted-foreground">Books you’ve saved</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading favorites...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : books.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No favorites yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

