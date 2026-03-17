import Link from 'next/link';
import { BookOpen, Atom, Cpu, User, Clock, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Atom,
  Cpu,
  User,
  Clock,
  Brain,
};

export async function CategoriesSection() {
  const categories = await getCategories();
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find your next read in your favorite genre
          </p>
        </div>

        {/* Category Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || BookOpen;
            
            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={cn(
                  'group relative overflow-hidden rounded-xl border border-border bg-card p-6',
                  'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10'
                )}
              >
                {/* Glow Effect */}
                <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-accent/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.bookCount} books
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
