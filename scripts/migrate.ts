import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';

async function main() {
  if (!process.env.POSTGRES_URL) {
    console.log('[migrate] POSTGRES_URL not set — skipping migrations (OK during first Vercel build before you connect Postgres).');
    return;
  }
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('[migrate] migrations applied');
}

main().catch((err) => {
  console.error('[migrate] failed:', err);
  process.exit(1);
});
