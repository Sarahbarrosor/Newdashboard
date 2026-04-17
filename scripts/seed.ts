import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { locations, users, products, stockLevels } from '../lib/db/schema';
import { COUNTRY_META, type CountryCode } from '../lib/constants';

const SEED_USERS: Array<{
  email: string;
  name: string;
  role: 'global_admin' | 'country_admin';
  country: CountryCode | null;
  password: string;
}> = [
  { email: 'laura@cellgenic.com',  name: 'Laura Benítez', role: 'global_admin',  country: null, password: 'cellgenic-global' },
  { email: 'sarah@cellgenic.com',  name: 'Sarah Reyes',   role: 'country_admin', country: 'US', password: 'cellgenic-us' },
  { email: 'diego@cellgenic.com',  name: 'Diego Morales', role: 'country_admin', country: 'MX', password: 'cellgenic-mx' },
  { email: 'ana@cellgenic.com',    name: 'Ana López',     role: 'country_admin', country: 'CO', password: 'cellgenic-co' },
  { email: 'matias@cellgenic.com', name: 'Matías Silva',  role: 'country_admin', country: 'AR', password: 'cellgenic-ar' },
  { email: 'carlos@cellgenic.com', name: 'Carlos Ruiz',   role: 'country_admin', country: 'ES', password: 'cellgenic-es' },
];

const SEED_PRODUCTS = [
  { sku: 'CG-UMSC-C20', name: 'UC-MSC, Cryopreserved',   category: 'Cellular', cells: '2.1×10⁶' },
  { sku: 'CG-EXO-MSC',  name: 'MSC-Derived Exosomes',    category: 'Exosomes', cells: '5×10¹¹' },
  { sku: 'CG-PEP-BPC',  name: 'BPC-157 Peptide',         category: 'Peptide',  cells: '10 mg' },
  { sku: 'CG-PEP-TB4',  name: 'Thymosin Beta-4',         category: 'Peptide',  cells: '5 mg' },
  { sku: 'CG-AMSC-C15', name: 'AD-MSC, Cryopreserved',   category: 'Cellular', cells: '1.5×10⁶' },
  { sku: 'CG-HRM-TST',  name: 'Testosterone Cypionate',  category: 'Hormone',  cells: '200 mg/mL' },
];

const SEED_STOCK: Record<string, Record<CountryCode, { qty: number; threshold: number }>> = {
  'CG-UMSC-C20': { US: { qty: 84, threshold: 20 }, MX: { qty: 22, threshold: 20 }, CO: { qty: 14, threshold: 20 }, AR: { qty: 30, threshold: 20 }, ES: { qty: 48, threshold: 20 } },
  'CG-EXO-MSC':  { US: { qty: 52, threshold: 15 }, MX: { qty:  8, threshold: 15 }, CO: { qty: 22, threshold: 15 }, AR: { qty: 14, threshold: 15 }, ES: { qty: 30, threshold: 15 } },
  'CG-PEP-BPC':  { US: { qty:120, threshold: 40 }, MX: { qty: 48, threshold: 40 }, CO: { qty: 60, threshold: 40 }, AR: { qty: 72, threshold: 40 }, ES: { qty: 96, threshold: 40 } },
  'CG-PEP-TB4':  { US: { qty: 68, threshold: 10 }, MX: { qty:  3, threshold: 10 }, CO: { qty: 40, threshold: 10 }, AR: { qty: 55, threshold: 10 }, ES: { qty: 80, threshold: 10 } },
  'CG-AMSC-C15': { US: { qty: 46, threshold: 15 }, MX: { qty: 18, threshold: 15 }, CO: { qty: 12, threshold: 15 }, AR: { qty: 24, threshold: 15 }, ES: { qty: 36, threshold: 15 } },
  'CG-HRM-TST':  { US: { qty:210, threshold: 80 }, MX: { qty:120, threshold: 80 }, CO: { qty: 88, threshold: 80 }, AR: { qty:156, threshold: 80 }, ES: { qty:180, threshold: 80 } },
};

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL not set. Pull env vars first with `vercel env pull .env.local`.');
  }

  console.log('[seed] locations');
  for (const code of Object.keys(COUNTRY_META) as CountryCode[]) {
    const meta = COUNTRY_META[code];
    await db
      .insert(locations)
      .values({ code, name: meta.name, city: meta.city, currency: meta.currency })
      .onConflictDoNothing({ target: locations.code });
  }

  console.log('[seed] users');
  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const existing = await db.select().from(users).where(eq(users.email, u.email)).limit(1);
    if (existing[0]) {
      console.log(`  · skip ${u.email} (exists)`);
      continue;
    }
    await db.insert(users).values({
      email: u.email,
      name: u.name,
      role: u.role,
      countryCode: u.country,
      passwordHash,
    });
    console.log(`  · ${u.email} (${u.role}${u.country ? ' / ' + u.country : ''})`);
  }

  console.log('[seed] products');
  for (const p of SEED_PRODUCTS) {
    await db.insert(products).values(p).onConflictDoNothing({ target: products.sku });
  }

  console.log('[seed] stock levels');
  const locRows = await db.select().from(locations);
  const prodRows = await db.select().from(products);
  const locByCode = new Map(locRows.map((r) => [r.code, r.id]));
  const prodBySku = new Map(prodRows.map((r) => [r.sku, r.id]));

  for (const [sku, byCountry] of Object.entries(SEED_STOCK)) {
    const productId = prodBySku.get(sku);
    if (!productId) continue;
    for (const [code, { qty, threshold }] of Object.entries(byCountry) as Array<[CountryCode, { qty: number; threshold: number }]>) {
      const locationId = locByCode.get(code);
      if (!locationId) continue;
      await db
        .insert(stockLevels)
        .values({ productId, locationId, qtyOnHand: qty, threshold })
        .onConflictDoNothing();
    }
  }

  console.log('[seed] done');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
