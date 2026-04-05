'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getBooks, getCategories } from '@/lib/api';
import type { Book, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

type SortOption = 'rating' | 'reviews' | 'title' | 'year';
type ViewMode = 'grid' | 'list';

function BooksPageContent() {
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [minRating, setMinRating] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    Promise.all([getBooks({ limit: 50 }), getCategories()])
      .then(([booksRes, cats]) => {
        setBooks(booksRes.items);
        setCategories(cats);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((book) => book.categoryId === selectedCategory);
    }

    if (minRating > 0) {
      result = result.filter((book) => book.averageRating >= minRating);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.publishedYear - a.publishedYear;
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchQuery, selectedCategory, sortBy, minRating]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    minRating > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinRating(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-16">
            <p className="text-destructive">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ensure the API server is running
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Browse Books
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore our collection of {books.length} books across {categories.length} categories
            </p>
          </div>

          {/* Search + Filters */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring transition-all focus:ring-2"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters

                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="year">Newest First</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden items-center gap-1 rounded-lg border border-input p-1 sm:flex">

                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-md p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>

              </div>

            </div>
          </div>

          {/* Books */}
          {filteredBooks.length > 0 ? (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'flex flex-col gap-4'
              )}
            >
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No books found
              </p>

              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading books...</div>}>
      <BooksPageContent />
    </Suspense>
  );
}