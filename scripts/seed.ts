import 'dotenv/config';
import { runSeed } from '../lib/seed';

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL not set. Pull env vars first with `vercel env pull .env.local`.');
  }
  const report = await runSeed();
  console.log('[seed]', report);
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
