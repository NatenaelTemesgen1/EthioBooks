import { BookOpen, Users, Star, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Vast Library',
    description: 'Access thousands of books across every genre, from classic literature to modern bestsellers.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Connect with fellow readers, share recommendations, and discover new perspectives.',
  },
  {
    icon: Star,
    title: 'Honest Reviews',
    description: 'Read authentic reviews from real readers to find books that truly resonate with you.',
  },
  {
    icon: MessageSquare,
    title: 'Active Discussions',
    description: 'Engage in thoughtful conversations about your favorite books and authors.',
  },
];

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              About EthioBooks
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We believe that every book has the power to transform lives. EthioBooks was founded 
              with a simple mission: to connect readers with books that inspire, educate, and entertain.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our platform brings together a passionate community of book lovers who share their 
              honest reviews and recommendations. Whether you are looking for your next great read or 
              want to share your thoughts on a recent favorite, EthioBooks is your home.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
