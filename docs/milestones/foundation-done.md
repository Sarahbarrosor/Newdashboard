# Foundation — Done

## Files added

**Config:** `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `drizzle.config.ts`, `.eslintrc.json`, `.env.example`, `.gitignore`

**Database:** `lib/db/schema.ts`, `lib/db/index.ts`, `drizzle/0000_init.sql`, `drizzle/meta/_journal.json`, `drizzle/meta/0000_snapshot.json`, `scripts/migrate.ts`, `scripts/seed.ts`

**Auth:** `auth.config.ts` (edge-safe), `auth.ts` (Node-only with Credentials provider), `lib/auth/helpers.ts`, `middleware.ts`, `app/api/auth/[...nextauth]/route.ts`

**App:** `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/login/page.tsx`, `app/login/actions.ts`, `app/dashboard/page.tsx`

**Shared:** `lib/constants.ts`

**Prototype preserved:** `public/prototype/mock-data.js`, `public/prototype/ui-components.js`, `public/prototype/index.html` (served at `/prototype/`)

**Docs:** `README.md`, `DEPLOY.md`, `docs/milestones/foundation-plan.md`, `docs/milestones/foundation-done.md`

## Environment variables required for Foundation

- `POSTGRES_URL` (+ the other `POSTGRES_*` vars Vercel auto-sets)
- `NEXTAUTH_SECRET` — 32-byte random
- `NEXTAUTH_URL` — production URL only

Optional (wired in later milestones): `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `KATANA_*`, `QUICKBOOKS_*`, `ENCRYPTION_KEY`.

## Commands

```bash
npm install              # install deps
npm run dev              # local dev (needs .env.local)
npm run build            # runs migrate then builds
npm run db:seed          # seed locations, users, products, stock
```

## Manual verification

After deploy + seed (per `DEPLOY.md`):

1. Visit `/dashboard` while logged out → redirects to `/login`.
2. Log in as `diego@cellgenic.com` / `cellgenic-mx` → lands on `/dashboard`.
3. Dashboard shows: **"Hello Diego Morales, MX MX"** with role `country_admin`.
4. Sign-out button returns to `/login`.
5. `/prototype/` renders the visual prototype (inventory table + country switcher).

## Known limitations / deferred work

- **No UI for password change yet.** Initial passwords in `scripts/seed.ts` are placeholders. Rotate via DB until a later milestone ships a profile page.
- **No user management UI.** New users must be added to `scripts/seed.ts` and re-seeded (insert-only; existing users skipped).
- **Activity log is unused.** Write paths will start logging in the Transfer milestone.
- **Access control is route-level, not DB-level.** Without Supabase RLS, every write path must call `requireCountryWrite(code)` — enforced by code review + tests in subsequent milestones.
- **`drizzle-kit generate` was not run in this environment**, so `drizzle/meta/0000_snapshot.json` is a stub. After your first `npm install`, run `npm run db:generate` locally to regenerate it against the real schema — the SQL migration itself (`0000_init.sql`) is hand-verified and complete.
- **No tests yet.** Vitest suite deferred to after Dashboard milestone (the RLS tests from the original plan don't apply without Supabase; equivalent route-handler tests land with Transfer).

## Next steps for you

1. Follow `DEPLOY.md` steps 1–6.
2. Once logged in at the dashboard, reply `go to Katana Sync` and I'll start the next milestone.

If anything goes wrong during deploy, paste the error from the Vercel Logs tab and I'll fix it.
