import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Cellgenic</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to continue</p>
        </div>
        <Suspense fallback={<div className="h-72 rounded-lg border border-surface-border bg-surface-card shadow-xs" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-ink-muted">Need access? Ask your global admin.</p>
      </div>
    </main>
  );
}
