import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- LINKS ---------------- */

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

const communityLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/top-readers", label: "Top Readers" },
  { href: "/forum", label: "Forum" },
];

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/documentation", label: "Documentation" },
  { href: "/faq", label: "FAQ" },
];

const socialLinks = [
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

/* ---------------- FOOTER COLUMN ---------------- */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-serif text-sm font-semibold text-white">{title}</h4>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block text-sm text-slate-400 transition-all duration-200 hover:text-emerald-400 hover:translate-x-1"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */

export function Footer() {
  return (
    <footer className="relative mt-24">

      {/* Curved Top Shape */}
      <div className="absolute -top-20 left-0 w-full overflow-hidden leading-0">
        <svg
          className="relative block w-full h-24"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,69.3C1120,85,1280,107,1360,117.3L1440,128V0H0Z"
            className="fill-slate-950"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="bg-linear-to-b from-slate-950 to-slate-900 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-serif text-3xl font-bold text-white">
                  Ethio<span className="text-emerald-400">Books</span>
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
                Discover your next favorite book with EthioBooks. Join thousands
                of readers sharing reviews, recommendations, and a love for literature.
              </p>

              {/* Newsletter */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white">
                  Subscribe to our newsletter
                </h4>

                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-10 flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />

                  <Button className="rounded-full bg-emerald-500 hover:bg-emerald-400 transition">
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Columns */}
            <FooterColumn title="Platform" links={platformLinks} />
            <FooterColumn title="Community" links={communityLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />

          </div>

          {/* Bottom Section */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 sm:flex-row">

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} EthioBooks. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full p-2 bg-slate-800 hover:bg-emerald-500 transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5 text-slate-300 group-hover:text-white transition" />
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}