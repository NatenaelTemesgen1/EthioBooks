import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { getMyFavorites } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  let books: any[] = [];
  let error: string | null = null;
  try {
    books = await getMyFavorites();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load favorites';
  }

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

          {error ? (
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

