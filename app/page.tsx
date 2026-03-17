import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { PopularBooksSection } from '@/components/sections/popular-books-section';
import { CategoriesSection } from '@/components/sections/categories-section';
import { LatestReviewsSection } from '@/components/sections/latest-reviews-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { AboutSection } from '@/components/sections/about-section';
import { CtaSection } from '@/components/sections/cta-section';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <PopularBooksSection />
        <CategoriesSection />
        <LatestReviewsSection />
        <TestimonialsSection />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
