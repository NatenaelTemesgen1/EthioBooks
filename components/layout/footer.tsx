import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
];

const communityLinks = [
  { href: '/reviews', label: 'Reviews' },
  { href: '/top-readers', label: 'Top Readers' },
  { href: '/forum', label: 'Forum' },
];

const resourceLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/documentation', label: 'Documentation' },
  { href: '/faq', label: 'FAQ' },
];

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-foreground">
                Ethio<span className="text-accent">Books</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Discover your next favorite book with EthioBooks. Join thousands of readers sharing 
              reviews, recommendations, and a love for literature.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground">Subscribe to our newsletter</h4>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring transition-all focus:ring-2"
                />
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground">Community</h4>
            <ul className="mt-4 space-y-3">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground">Resources</h4>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EthioBooks. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-accent"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
