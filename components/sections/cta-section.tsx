import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative py-28">

      {/* Top Curve */}
      <div className="absolute -top-16 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-16"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40C240,80 480,0 720,20C960,40 1200,80 1440,40L1440,0L0,0Z"
            className="fill-background"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6">

        {/* CTA Container */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-indigo-500/10 px-10 py-20 text-center shadow-xl">

          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">

            <h2 className="font-serif text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              Join Thousands of Readers Today
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Create your free account and start discovering, reviewing, and sharing
              your favorite books with our growing community.
            </p>

            {/* Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group min-w-45 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all"
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
                className="group min-w-45 rounded-full bg-background text-foreground hover:bg-muted transition-all"
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