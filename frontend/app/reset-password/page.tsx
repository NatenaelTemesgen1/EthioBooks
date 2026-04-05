import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ResetPasswordForm } from './reset-password-form';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Reset password</h1>
            <p className="mt-2 text-muted-foreground">Choose a new password.</p>
          </div>
          <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
            <ResetPasswordForm token={token} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

