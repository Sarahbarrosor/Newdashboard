import { NextResponse } from 'next/server';
import { runSeed } from '@/lib/seed';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized. Append ?secret=<NEXTAUTH_SECRET> to the URL.' }, { status: 401 });
}

async function handle(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'NEXTAUTH_SECRET not configured on the server.' }, { status: 500 });
  }

  const url = new URL(request.url);
  const provided = url.searchParams.get('secret');
  if (provided !== secret) return unauthorized();

  try {
    const report = await runSeed();
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
