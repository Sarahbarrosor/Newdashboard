'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get('from') || '/dashboard';
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-ink">Cellgenic</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to continue</p>
        </div>
        <form action={formAction} className="space-y-4 rounded-lg border border-surface-border bg-surface-card p-6 shadow-xs">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-ink-soft">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            />
          </label>
          {state.error && (
            <p className="rounded-md bg-status-dangerBg px-3 py-2 text-xs text-status-danger">{state.error}</p>
          )}
          <SubmitButton />
        </form>
        <p className="mt-6 text-center text-xs text-ink-muted">
          Need access? Ask your global admin.
        </p>
      </div>
    </main>
  );
}
