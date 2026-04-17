# Foundation — Milestone Plan

**Status:** awaiting `go`
**Goal:** Empty app runs, users log in, roles + RLS work end-to-end.

## Files to create

### Workspace
- `package.json` (root, private, pnpm workspaces)
- `pnpm-workspace.yaml` — `apps/*`, `packages/*`
- `tsconfig.base.json` — strict TS, shared paths
- `.nvmrc` — Node 20
- `.env.example` — every key referenced below (placeholders only)
- `.gitignore` — node_modules, .next, .env.local, .turbo, supabase/.temp
- `.editorconfig`, `.prettierrc`, `eslint.config.mjs`

### `packages/shared`
- `package.json`, `tsconfig.json`
- `src/constants.ts` — country codes `['US','MX','CO','AR','ES']`, role strings, transfer statuses
- `src/types.ts` — domain types (User, Location, Product, StockLevel, Transfer, ActivityLogEntry)
- `src/zod.ts` — base Zod schemas reused across apps

### `packages/db`
- `package.json`, `tsconfig.json`
- `src/client.ts` — Supabase browser + server client factories (anon + service role, with typing)
- `src/types.ts` — generated `Database` type (stub initially; regenerated via `supabase gen types`)
- `tests/rls.test.ts` — Vitest suite, details below

### `supabase/`
- `config.toml` — project id, local ports, auth hooks
- `migrations/0001_init.sql` — full Foundation schema (see §Schema)
- `migrations/0002_rls.sql` — RLS policies (see §RLS)
- `migrations/0003_auth_claims.sql` — trigger/function that mirrors `users.role` and `users.country_code` into JWT custom claims via an `access_token` hook
- `seed.sql` — 5 locations + 6 users (1 global, 5 country)

### `apps/web` (Next.js 14 App Router)
- `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`
- `app/layout.tsx`, `app/globals.css`
- `app/(auth)/login/page.tsx` — email + password form, server action calls Supabase Auth
- `app/(auth)/logout/route.ts`
- `middleware.ts` — refreshes Supabase session, gates `/dashboard`
- `app/dashboard/page.tsx` — server component, reads session, renders `Hello {name}, country: {code}, role: {role}`
- `lib/supabase/server.ts`, `lib/supabase/client.ts`
- `lib/auth.ts` — `requireUser()` helper used by server components/route handlers

## Schema (migration `0001_init.sql`)

Enums
- `user_role` — `global_admin | country_admin | viewer`
- `transfer_status` — `pending | transit | received | cancelled`
- `country_code` — `US | MX | CO | AR | ES`

Tables
- `locations` (`id uuid pk`, `code country_code unique`, `name text`, `city text`, `currency text`, `created_at timestamptz default now()`)
- `users` (`id uuid pk references auth.users`, `email citext unique`, `name text`, `role user_role`, `country_code country_code null`, `created_at timestamptz`)
  - constraint: `role = 'global_admin'` ↔ `country_code is null`; `role in ('country_admin','viewer')` ↔ `country_code is not null`
- `products` (`id uuid pk`, `sku text unique`, `name text`, `category text`, `unit text`, `cells text`, `last_synced timestamptz`, timestamps)
- `stock_levels` (`id uuid pk`, `product_id uuid fk`, `location_id uuid fk`, `qty_on_hand int`, `threshold int`, `last_synced timestamptz`, unique `(product_id, location_id)`)
- `transfers` (`id uuid pk`, `reference_code text unique`, `from_location_id uuid fk`, `to_location_id uuid fk`, `product_id uuid fk`, `qty int check (qty > 0)`, `status transfer_status default 'pending'`, `urgent bool default false`, `note text`, `created_by uuid fk users`, `approved_by uuid fk users null`, `received_by uuid fk users null`, timestamps)
  - `reference_code` generated via sequence-backed trigger → `TRF-00000`
- `activity_log` (`id uuid pk`, `event_type text`, `tone text`, `country_code country_code null`, `actor_id uuid fk users null`, `subject_type text`, `subject_id uuid null`, `text text`, `payload jsonb`, `created_at timestamptz default now()`)

Indexes on `stock_levels(location_id)`, `transfers(status)`, `activity_log(country_code, created_at desc)`.

## RLS (migration `0002_rls.sql`)

Helper SQL function `auth.country_code()` reads `request.jwt.claims ->> 'country'`; `auth.role_claim()` reads `request.jwt.claims ->> 'role'`.

Per-table policies (ALL six tables enable RLS):
- `locations` — read: all authed; write: global_admin only.
- `products` — read: all authed; write: global_admin + sync service role.
- `stock_levels` — read: all authed; update: `role = 'global_admin'` OR (`role = 'country_admin'` AND `location_id` resolves to `auth.country_code()`). This is the policy quoted verbatim from section 4.2; the doc text will be reproduced here once I have access (see Q2).
- `transfers` — read: all authed; insert: creator's country must equal `from_location_id.country`; update (approve/reject/receive): only destination country_admin or global_admin.
- `activity_log` — insert: any authed user writing their own actor_id, OR service role; select: authed users, filtered to own country for country_admin via policy (global reads all).
- `users` — read self + global_admin reads all; update: self updates limited fields; global_admin updates role/country.

Service-role key bypasses RLS and is only used from `apps/sync-worker` (future) and migration scripts.

## Seed (`seed.sql`)

- 5 rows in `locations` (US/Miami, MX/Guadalajara, CO/Bogotá, AR/Buenos Aires, ES/Madrid) with currencies from the mock data file already in the repo.
- 6 users inserted into `auth.users` via Supabase admin API (handled by a Node script `packages/db/scripts/seed-users.ts`, not raw SQL, because `auth.users` requires hashed passwords):
  - Laura Benítez — global_admin
  - Sarah Reyes — US country_admin
  - Diego Morales — MX country_admin
  - Ana López — CO country_admin
  - Matías Silva — AR country_admin
  - Carlos Ruiz — ES country_admin
  - All initial passwords `cellgenic-dev-<code>`; `.env.example` documents them; production seed disabled.

## Auth / JWT claims

Supabase Auth custom access token hook (Postgres function `public.handle_access_token`) runs on every token mint, looks up `public.users` by `sub`, and merges `{ role, country }` into `claims`. Enabled in `config.toml` under `[auth.hook.custom_access_token]`.

## Vitest RLS test (`packages/db/tests/rls.test.ts`)

Assumes `supabase start` has been run (documented in done.md). For each case, creates a Supabase client with the seeded user's JWT and asserts behavior:

1. **MX admin reads all countries** — `select('*').from('stock_levels')` returns rows for all 5 location codes.
2. **MX admin updates own country** — `update({ threshold: 99 }).eq('location_id', <MX id>)` succeeds; rowcount ≥ 1.
3. **MX admin cannot update US** — `update({ threshold: 99 }).eq('location_id', <US id>)` returns 0 rows modified (PostgREST surfaces this as an empty result, not an error, under RLS USING-only policies; test asserts rowcount = 0 and subsequent `select` confirms threshold unchanged). If we want a hard error instead we must add a `WITH CHECK` that raises — I'll use WITH CHECK and assert the error; clarified in Q3.
4. **Global admin** — updates succeed against any location.

Tests use Vitest's `beforeAll` to sign in with the seeded credentials and cache tokens.

## Acceptance criteria

- `pnpm install && pnpm -r typecheck && pnpm -F @cellgenic/web build` all pass.
- `supabase db reset` applies all 3 migrations + seed without error.
- `pnpm -F @cellgenic/db test` passes the 4 RLS assertions against a running local Supabase.
- Visiting `http://localhost:3000/dashboard` while logged out redirects to `/login`; after login as MX admin, page shows `Hello Diego Morales, country: MX, role: country_admin`.

## Commit

Single commit: `feat(foundation): workspace, schema, RLS, auth, login, dashboard shell`.

## Out of scope (deferred to later milestones)

- shadcn/ui install and theming (added in Dashboard milestone, not needed for the "Hello …" screen).
- Activity-log triggers on write paths (wired when Transfer milestone lands its first writes).
- Supabase Realtime subscriptions (Dashboard milestone).
- Existing `mock-data.js` / `ui-components.js` files — see Q1.
