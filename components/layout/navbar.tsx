'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  User,
  LogIn,
  ChevronDown,
  Settings,
  LogOut,
  Heart,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ✅ Define full user type
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  reviewCount: number;
  favoriteBooks: string[];
  joinedAt: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);  // ✅ Full user object
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Dark mode effect
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && systemTheme)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const runSearch = () => {
    const q = searchQuery.trim();
    if (!q) {
      router.push('/books');
      return;
    }
    router.push(`/books?search=${encodeURIComponent(q)}`);
    setIsSearchOpen(false);
    setIsOpen(false);
  };

  // ✅ Sync user function - fetches FULL user data
  const syncUser = async () => {
    try {
      const { getMe } = await import('@/lib/api/authApi');
      const response = await getMe();
      
      if (response?.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        setIsAdmin(response.user.role === 'admin');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  // ✅ Initial load and event listener
  useEffect(() => {
    let cancelled = false;
    
    const loadUser = async () => {
      if (cancelled) return;
      await syncUser();
    };
    
    loadUser();
    
    // Listen for user update events (after profile edit, avatar upload)
    const onUserUpdated = () => {
      syncUser();
    };
    window.addEventListener('ethiobooks:user-updated', onUserUpdated);
    
    return () => {
      cancelled = true;
      window.removeEventListener('ethiobooks:user-updated', onUserUpdated);
    };
  }, []);

  // ✅ Re-sync when pathname changes (after login/register redirect)
  useEffect(() => {
    syncUser();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <span className="font-serif text-2xl font-bold text-foreground">
            Ethio<span className="text-accent">Books</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group relative px-4 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
              <span
                className={cn(
                  'absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-accent transition-all duration-300 group-hover:w-4/5',
                  pathname === link.href && 'w-4/5'
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 hidden sm:inline-flex"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Search */}
          <div className="relative hidden sm:block">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSearch();
                  }}
                  className="h-9 w-48 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring transition-all focus:ring-2 lg:w-64"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={runSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                    {user.avatar ? (
                      <img
                        src={user.avatar.startsWith('http') ? user.avatar : user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                        // ✅ Add timestamp to force refresh on image update
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent/20 text-accent">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive"
                  onClick={async () => {
                    try {
                      const { logout } = await import('@/lib/api/authApi');
                      await logout();
                      setIsLoggedIn(false);
                      setIsAdmin(false);
                      setUser(null);
                    } finally {
                      window.location.href = '/';
                    }
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col p-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSearch();
                  }}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring transition-all focus:ring-2"
                />
              </div>
              <Button variant="outline" className="mt-2 w-full" onClick={runSearch}>
                Search
              </Button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent/20 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle */}
            <Button
              variant="outline"
              className="mt-2 flex items-center justify-center gap-2"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Button>

            {!isLoggedIn && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}