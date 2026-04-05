'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Missing token');
      if (password.length < 8) throw new Error('Password must be at least 8 characters');
      if (password !== confirm) throw new Error('Passwords do not match');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'Reset failed');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-foreground">Password updated. Redirecting to login…</p>}

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button className="w-full" onClick={submit} disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </>
  );
}

