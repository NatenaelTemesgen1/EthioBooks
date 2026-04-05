import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, BookOpen, Atom, Cpu, User, Clock, Brain } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard } from '@/components/book/book-card';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/lib/api';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Atom,
  Cpu,
  User,
  Clock,
  Brain,
};

async function fetchCategoryBooks(categoryId: string) {
  const res = await fetch(`${API_BASE}/categories/${categoryId}/books?limit=100`, { cache: 'no-store' });
  if (!res.ok) return { items: [] as any[] };
  return res.json();
}

export default async function CategoryByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, booksRes] = await Promise.all([
    getCategories(),
    fetchCategoryBooks(id),
  ]);

  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const Icon = iconMap[category.icon] || BookOpen;
  const items = booksRes.items ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/categories" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              All Categories
            </Link>
          </Button>

          <div className="mb-12 flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {items.length} {items.length === 1 ? 'book' : 'books'} in this category
              </p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No books found in this category yet</p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/books">Browse All Books</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

