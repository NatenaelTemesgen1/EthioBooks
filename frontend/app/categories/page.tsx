import Link from 'next/link';
import { BookOpen, Atom, Cpu, User, Clock, Brain, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getCategories } from '@/lib/api';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Atom,
  Cpu,
  User,
  Clock,
  Brain,
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Browse Categories
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Explore our curated collection of books organized by genre. 
              Find your perfect read in your favorite category.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || BookOpen;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border border-border bg-card p-8',
                    'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10'
                  )}
                >
                  {/* Background Gradient */}
                  <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="h-8 w-8" />
                    </div>

                    {/* Content */}
                    <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {category.bookCount} books available
                    </p>

                    {/* Link */}
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent transition-colors group-hover:text-accent">
                      Browse Collection
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
