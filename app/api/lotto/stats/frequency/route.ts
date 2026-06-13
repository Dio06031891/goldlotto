import { NextResponse } from 'next/server';
import { getCachedFrequency } from '@/lib/lotto/cached-frequency';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getCachedFrequency();
    if (!payload) {
      return NextResponse.json({ error: 'STATS_UNAVAILABLE' }, { status: 503 });
    }
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: 'FETCH_FAILED' }, { status: 502 });
  }
}
