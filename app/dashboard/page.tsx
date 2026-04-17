import { requireUser } from '@/lib/auth/helpers';
import { signOut } from '@/auth';
import { COUNTRY_META } from '@/lib/constants';

export default async function DashboardPage() {
  const user = await requireUser();
  const country = user.countryCode ? COUNTRY_META[user.countryCode] : null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">Cellgenic Operations</p>
          <h1 className="mt-1 font-serif text-4xl text-ink">Dashboard</h1>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            className="rounded-md border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-brand-600 hover:text-brand-600"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="rounded-lg border border-surface-border bg-white p-8 shadow-xs">
        <p className="font-serif text-2xl text-ink">
          Hello {user.name ?? user.email}
          {country ? <>, <span className="text-brand-600">{country.flag} {user.countryCode}</span></> : null}
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Role</dt>
            <dd className="mt-1 font-mono text-ink">{user.role}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Country</dt>
            <dd className="mt-1 font-mono text-ink">{user.countryCode ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Email</dt>
            <dd className="mt-1 font-mono text-ink">{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 rounded-lg border border-dashed border-surface-border bg-surface p-6 text-sm text-ink-soft">
        <p className="font-medium text-ink">Foundation milestone — operational.</p>
        <p className="mt-1">
          Authentication, schema, and role-aware access helpers are wired. Upcoming milestones add the Katana sync, transfer
          workflow, live dashboard widgets, AI reports, and product document library.
        </p>
        <p className="mt-3">
          The visual prototype from the design phase lives at{' '}
          <a href="/prototype/" className="font-medium text-brand-600 underline underline-offset-2">
            /prototype
          </a>
          .
        </p>
      </section>
    </main>
  );
}
