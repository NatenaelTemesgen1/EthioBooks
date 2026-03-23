'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Book, User } from '@/lib/types';
import { getMeProfile, getMyFavorites, updateMeProfile } from '@/lib/api';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    let cancelled = false;
    getMeProfile()
      .then((u) => {
        if (cancelled) return;
        setUser(u);
        setName(u.name ?? '');
        setEmail(u.email ?? '');
        setAvatar(u.avatar ?? '');
        setAvatarTimestamp(Date.now());
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load profile'))
      .finally(() => setLoading(false));

    getMyFavorites()
      .then((items) => {
        if (cancelled) return;
        setFavorites(items);
      })
      .catch(() => {
        if (cancelled) return;
        setFavorites([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const uploadAvatar = async (file: File) => {
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'Upload failed');
      setAvatar(data.url ?? '');
      setAvatarTimestamp(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMeProfile({ name, email, avatar });
      setUser(updated);
      if (updated.avatar !== avatar) {
        setAvatar(updated.avatar);
        setAvatarTimestamp(Date.now());
      }
      window.dispatchEvent(new Event('ethiobooks:user-updated'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">Profile</h1>
            <p className="mt-2 text-muted-foreground">Update your name, email, and photo</p>
          </div>

          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {!loading && user && (
            <>
              <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    {/* Add timestamp to force refresh */}
                    <AvatarImage src={avatar ? `${avatar}?t=${avatarTimestamp}` : ''} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadAvatar(file);
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Name</p>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email</p>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <Button onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-foreground">My Favorites</h2>
                  <Button variant="outline" asChild>
                    <Link href="/favorites">Open Favorites</Link>
                  </Button>
                </div>
                {favorites.length > 0 ? (
                  <ul className="space-y-2">
                    {favorites.slice(0, 4).map((book) => (
                      <li key={book.id} className="text-sm text-muted-foreground">
                        - {book.title} by {book.author}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No favorites yet. Add some books to favorites.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}