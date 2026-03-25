import Link from 'next/link';
import { BookOpen, Users, Star, MessageSquare, Heart, Globe, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '10,000+', label: 'Books', icon: BookOpen },
  { value: '50,000+', label: 'Readers', icon: Users },
  { value: '15,000+', label: 'Reviews', icon: MessageSquare },
  { value: '250+', label: 'Countries', icon: Globe },
];

const values = [
  {
    icon: BookOpen,
    title: 'Passion for Reading',
    description: 'We believe in the transformative power of books and their ability to change lives, broaden perspectives, and inspire growth.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our platform is built around the idea that reading is better when shared. We foster meaningful connections between readers worldwide.',
  },
  {
    icon: Star,
    title: 'Honest Reviews',
    description: 'We value authentic, thoughtful reviews that help readers make informed decisions about their next read.',
  },
  {
    icon: Heart,
    title: 'Inclusive Space',
    description: 'EthioBooks welcomes readers of all backgrounds, interests, and reading levels. Every perspective enriches our community.',
  },
];

const team = [
  {
    name: 'Yohannes Melakamu',
    role: 'Founder & CEO',
    image: '/photo_2026-03-24_08-16-56.jpg',
    bio: 'Former librarian with a passion for connecting readers with their perfect books.',
  },
  {
    name: 'Biniyam Molla',
    role: 'Head of Product',
    image: '/photo_2026-03-24_08-05-57.jpg',
    bio: 'Tech enthusiast who believes in building products that bring joy to users.',
  },
  {
    name: 'Biruk Eshetie',
    role: 'Community Manager',
    image: '/photo_2026-03-24_08-07-17.jpg',
    bio: 'Book club organizer turned community builder, fostering reader connections.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                About EthioBooks
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We are building the world&apos;s most welcoming community for book lovers. 
                Our mission is to connect readers with books that inspire, educate, and 
                entertain, while fostering meaningful conversations about literature.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-accent/30 hover:shadow-md"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-serif text-3xl font-bold text-accent">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                  Our Story
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    EthioBooks began as a simple idea: what if there was a place where readers 
                    could not only discover new books but also connect with others who share 
                    their passion for reading?
                  </p>
                  <p>
                    Founded in 2024, we started as a small community of book enthusiasts who 
                    wanted to create something different from the typical book review site. 
                    We believed that the magic of reading comes not just from the books 
                    themselves, but from the conversations and connections they inspire.
                  </p>
                  <p>
                    Today, EthioBooks has grown into a thriving global community of readers, 
                    but our core mission remains the same: to help every reader find their 
                    next favorite book and share their love of literature with the world.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-4/3 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=cro"
                    alt="Library interior"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 aspect-square w-48 overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                  <img
                    src="\uploads\photo_2026-03-24_08-01-00.jpg"
                    alt="Person reading"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Meet the Team
              </h2>
              <p className="mt-4 text-muted-foreground">
                The passionate readers behind EthioBooks
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-accent">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
       <section className="relative py-28">

      {/* Top Curve */}
      <div className="absolute -top-16 left-0 w-full overflow-hidden leading-0">
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
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-emerald-500/10 via-background to-indigo-500/10 px-10 py-20 text-center shadow-xl">

          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">

            <h2 className="font-serif text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
Join Our Community            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Become part of a global community of book lovers. Share reviews, 
                discover new reads, and connect with fellow readers.
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
                Create Free Account
                </Link>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group min-w-45 rounded-full bg-background text-foreground hover:bg-muted transition-all"
              >
                <Link href="/books" className="flex items-center gap-2">
                 Browse Books                
   </Link>
              </Button>

            </div>

          </div>

        </div>

      </div>
    </section>
      </main>
      <Footer />
    </div>
  );
}














                





