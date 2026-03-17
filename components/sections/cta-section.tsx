import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/80 px-6 py-16 text-center sm:px-12 lg:px-20">
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-accent blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-accent blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              <span className="text-balance">Join Thousands of Readers Today</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
              Create your free account and start discovering, reviewing, and sharing 
              your favorite books with our growing community.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group min-w-45 bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/register" className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Create Account
                </Link>
              </Button>
               <Button
                size="lg"
                variant="secondary"
                asChild
                className="group min-w-45 bg-background text-foreground hover:bg-background/90"
              >
                <Link href="/books" className="flex items-center gap-2">
                  Explore Books
                </Link>
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
