import { Quote } from 'lucide-react';
import { testimonials } from '@/lib/data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RatingStars } from '@/components/book/rating-stars';

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            What Readers Say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join thousands of happy readers in our community
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const initials = testimonial.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase();

            return (
              <div
                key={testimonial.id}
                className="relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                {/* Quote Icon */}
                <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/20" />

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed">
                  {`"${testimonial.comment}"`}
                </p>

                {/* Rating */}
                <RatingStars rating={testimonial.rating} size="sm" className="mt-4" />

                {/* Author */}
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar className="h-10 w-10 border-2 border-accent/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
