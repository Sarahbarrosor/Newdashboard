# Deploy — step-by-step (no code required)

This guide gets the app running on Vercel and connected to a real Postgres database. You won't touch any code. Just click through the steps in order, and paste values where indicated.

> **Time required:** ~15 minutes the first time.
> **What you need beforehand:** a Vercel account connected to your GitHub account.

---

## 1. Import the repo into Vercel

1. Go to **https://vercel.com/new**.
2. If asked, connect your GitHub account and grant access to **`sarahbarrosor/newdashboard`**.
3. Click **Import** next to the repo.
4. On the next screen:
   - **Framework Preset:** Next.js (auto-detected, leave it).
   - **Root Directory:** leave as `./`
   - **Environment Variables:** skip for now — we'll add them in step 3.
5. Click **Deploy**. The first deploy will likely fail because there's no database yet — that's expected.

---

## 2. Create the database

1. In your new Vercel project, go to **Storage → Create Database → Postgres**.
2. Pick a region close to your users (e.g. **Washington D.C. (iad1)** for the Americas, **Frankfurt (fra1)** for Europe).
3. Click **Create**. Vercel auto-links it to this project and **automatically adds the `POSTGRES_*` environment variables for you.**

---

## 3. Add the remaining environment variables

Go to **Settings → Environment Variables** and add the following. Apply each to all three environments (Production, Preview, Development) unless noted.

| Key | How to get the value | Required? |
|---|---|---|
| `NEXTAUTH_SECRET` | Generate one at **https://generate-secret.vercel.app/32** and paste the result. | **Yes** |
| `NEXTAUTH_URL` | Your Vercel URL, e.g. `https://newdashboard.vercel.app`. For preview envs, leave this blank. | **Yes, prod only** |
| `RESEND_API_KEY` | Create at **https://resend.com/api-keys** (free tier is fine). Starts with `re_…`. | Later (Notifications milestone) |
| `RESEND_FROM` | `onboarding@resend.dev` until you verify a domain. | Later |
| `ANTHROPIC_API_KEY` | Create at **https://console.anthropic.com/settings/keys**. Starts with `sk-ant-…`. | Later (AI Report milestone) |
| `KATANA_API_KEY` | From your Katana MRP account → Settings → API. | Later (Katana milestone) |
| `KATANA_WEBHOOK_SECRET` | Any strong random string. Generate at https://generate-secret.vercel.app/32. | Later |
| `QUICKBOOKS_CLIENT_ID` | From https://developer.intuit.com/ after creating an app. | Later |
| `QUICKBOOKS_CLIENT_SECRET` | Same place as the client ID. | Later |
| `QUICKBOOKS_ENVIRONMENT` | `sandbox` while testing, `production` when live. | Later |
| `ENCRYPTION_KEY` | Generate at https://generate-secret.vercel.app/32 (for encrypting QuickBooks tokens). | Later |

**For the Foundation milestone, only `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are strictly required.**

---

## 4. Redeploy

After adding env vars and the database:

1. Go to **Deployments** tab.
2. Click the three-dot menu on the latest deployment → **Redeploy**.
3. Wait for the build to finish (~2 minutes). The `prebuild` script runs the database migrations automatically.

---

## 5. Seed the database with starter users

This is the one step you need to do once, from your own computer. You only do it the first time.

### Option A — Use the "Seed" button (after Foundation ships)

Future milestones will add a one-click `/admin/seed` endpoint. For now, use Option B.

### Option B — Run the seed script locally (5 minutes, one time)

You need **Node.js 20+** installed. If you don't have it, download from https://nodejs.org (pick the LTS version).

1. Install the **Vercel CLI** once (copy-paste into your terminal):
   ```
   npm install -g vercel
   ```
2. In your terminal, navigate to a folder where you want a temporary copy of the project, then:
   ```
   git clone https://github.com/sarahbarrosor/newdashboard.git
   cd newdashboard
   vercel link
   ```
   When prompted, pick the `newdashboard` project you deployed.
3. Pull the env vars Vercel set for you:
   ```
   vercel env pull .env.local
   ```
4. Install dependencies and run the seed:
   ```
   npm install
   npm run db:seed
   ```
   You should see "locations", "users", "products", "stock levels", "done".

---

## 6. Log in

Open your Vercel URL (e.g. `https://newdashboard.vercel.app/login`) and sign in as any of the seeded users:

| Email | Role | Password |
|---|---|---|
| `laura@cellgenic.com`  | Global admin | `cellgenic-global` |
| `sarah@cellgenic.com`  | US country admin | `cellgenic-us` |
| `diego@cellgenic.com`  | MX country admin | `cellgenic-mx` |
| `ana@cellgenic.com`    | CO country admin | `cellgenic-co` |
| `matias@cellgenic.com` | AR country admin | `cellgenic-ar` |
| `carlos@cellgenic.com` | ES country admin | `cellgenic-es` |

> **Security note:** these passwords are placeholders. A later milestone adds a "change password" flow. Until then, don't put real customer data in this deployment.

---

## Troubleshooting

- **"Database connection failed" on first deploy.** Expected — Postgres wasn't connected yet. Complete step 2 then redeploy.
- **Migrations fail.** Check the Vercel **Logs** tab on the failed deploy. Most common cause: the database region is too far from the function region. Recreate the Postgres store in the same region as your project.
- **Can't log in.** Most likely the seed didn't run. Re-run step 5 Option B.
- **`/prototype/` shows a blank page.** Open the browser console — if you see CORS errors, hard-refresh (Cmd/Ctrl+Shift+R). The prototype uses CDN-hosted React + Babel.

---

## What's next

Ping me in Claude Code with "go to Katana Sync" once the Foundation deploy is green and you've logged in. I'll proceed through the remaining milestones:

1. ✅ Foundation (you are here)
2. Katana Sync (inventory data ingestion)
3. QuickBooks Sync (sales + financial data)
4. Transfer Module (end-to-end transfer workflow)
5. Dashboard (KPIs, inventory, activity, alerts)
6. AI Report (on-demand intelligence via Claude)
7. Product Database (SKU detail + document uploads)
8. Notifications (email + preferences)
9. QA & Launch (tests, runbook, UAT)
