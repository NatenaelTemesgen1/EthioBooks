'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setToken(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'Request failed');
      setMessage('If an account exists for that email, a reset link has been sent.');
      if (data?.token) setToken(data.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Forgot password</h1>
            <p className="mt-2 text-muted-foreground">We’ll help you reset it.</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-foreground">{message}</p>}

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="w-full" onClick={submit} disabled={loading || !email}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </div>

          {token && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Dev token (copy into reset page):
              </p>
              <p className="break-all text-sm font-mono">{token}</p>
              <Button asChild variant="outline">
                <Link href={`/reset-password?token=${encodeURIComponent(token)}`}>Open reset page</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

