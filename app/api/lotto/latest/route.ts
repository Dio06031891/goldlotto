import { NextResponse } from 'next/server';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const normalized = await getCachedLatestDraw();
    if (!normalized) {
      return NextResponse.json({ error: 'DRAW_NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json({ error: 'FETCH_FAILED' }, { status: 502 });
  }
}
