'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    let cancelled = false;
    
    const loadProfile = async () => {
      try {
        const u = await getMeProfile();
        if (cancelled) return;
        setUser(u);
        setName(u.name ?? '');
        setEmail(u.email ?? '');
        setAvatar(u.avatar ?? '');
        setAvatarTimestamp(Date.now());
      } catch (e) {
        if (cancelled) return;
        const errorMsg = e instanceof Error ? e.message : 'Failed to load profile';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const loadFavorites = async () => {
      try {
        const items = await getMyFavorites();
        if (!cancelled) setFavorites(items);
      } catch {
        if (!cancelled) setFavorites([]);
      }
    };

    loadProfile();
    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ UPLOAD AVATAR WITH TOAST MESSAGES
  const uploadAvatar = async (file: File) => {
    setError(null);
    setUploading(true);
    
    const loadingToast = toast.loading('Uploading avatar...');
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data?.message ?? 'Upload failed');
      
      setAvatar(data.url ?? '');
      setAvatarTimestamp(Date.now());
      
      // ✅ Fixed: Removed unused 't' parameter
      toast.success('Avatar uploaded successfully!', {
        icon: '🎉',
        duration: 3000,
      });
      
      window.dispatchEvent(new Event('ethiobooks:user-updated'));
      
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Upload failed';
      setError(errorMsg);
      
      // ✅ Fixed: Removed unused 't' parameter
      toast.error(errorMsg, {
        duration: 4000,
      });
      
    } finally {
      setUploading(false);
      toast.dismiss(loadingToast);
    }
  };

  // ✅ SAVE PROFILE WITH TOAST MESSAGES
  const save = async () => {
    setSaving(true);
    setError(null);
    
    const loadingToast = toast.loading('Saving profile changes...');
    
    try {
      const updated = await updateMeProfile({ name, email, avatar });
      setUser(updated);
      
      if (updated.avatar !== avatar) {
        setAvatar(updated.avatar);
        setAvatarTimestamp(Date.now());
      }
      
      // ✅ Fixed: Removed unused 't' parameter and used proper JSX
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Profile updated successfully!</span>
        </div>,
        {
          duration: 3000,
          icon: '✨',
        }
      );
      
      window.dispatchEvent(new Event('ethiobooks:user-updated'));
      
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Save failed';
      setError(errorMsg);
      
      // ✅ Fixed: Removed unused 't' parameter
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>{errorMsg}</span>
        </div>,
        {
          duration: 4000,
        }
      );
      
    } finally {
      setSaving(false);
      toast.dismiss(loadingToast);
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

          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {!loading && user && (
            <>
              <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage 
                      src={avatar ? `${avatar}?t=${avatarTimestamp}` : ''} 
                      alt={user.name} 
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadAvatar(file);
                      }}
                    />
                    {uploading && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Name</p>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email</p>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <Button onClick={save} disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
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