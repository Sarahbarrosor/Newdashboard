# Cellgenic Operations & Intelligence Platform

Multi-country inventory, transfer, and intelligence system for a nutraceutical company operating in **USA, Mexico, Spain, Colombia, Argentina**. Replaces fragmented WhatsApp workflows with a centralized platform that integrates Katana MRP (inventory) and QuickBooks (sales/financials) in real time, plus Claude-generated operational intelligence reports.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database:** Vercel Postgres + Drizzle ORM
- **Auth:** NextAuth.js v5 (credentials provider, JWT sessions)
- **File storage:** Vercel Blob (coming in Product Database milestone)
- **AI:** Anthropic Claude (`claude-sonnet-4-6`) — coming in AI Report milestone
- **Email:** Resend — coming in Notifications milestone
- **Integrations:** Katana MRP, QuickBooks Online — coming in their respective milestones
- **Hosting:** Vercel

## Deploying

See **[`DEPLOY.md`](./DEPLOY.md)** — step-by-step, no coding required.

## Local development

```bash
npm install
cp .env.example .env.local     # fill in values from your Vercel project
npm run dev
```

Open http://localhost:3000.

### Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (runs migrations first) |
| `npm run db:generate` | Generate a new migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed locations, users, products, stock |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Layout

```
app/                   Next.js App Router pages
  login/               Login form + server action
  dashboard/           Protected landing page
  api/auth/            NextAuth route
lib/
  db/                  Drizzle schema + client
  auth/                Role-aware authorization helpers
  constants.ts         Country + role enums
drizzle/               SQL migrations (auto-generated)
scripts/               Node utilities (migrate, seed)
public/prototype/      Static visual prototype (design reference)
docs/milestones/       One plan.md + done.md per milestone
```

## Access model

- **Global admin** — reads + writes for every country.
- **Country admin** — reads all countries, writes only their own.
- **Viewer** — reads only.

Enforced in route handlers via `lib/auth/helpers.ts` (`requireCountryWrite`, `requireGlobalAdmin`). See each milestone's `done.md` for which write paths are protected.

## Prototype

`/prototype/` serves the original React-via-CDN mock dashboard used during the design phase. Useful for comparing the real app against the visual target.
