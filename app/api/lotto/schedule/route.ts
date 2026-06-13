import { NextResponse } from 'next/server';
import { getCachedSchedule } from '@/lib/lotto/cached-schedule';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const episodes = await getCachedSchedule();
    if (!episodes?.length) {
      return NextResponse.json({ error: 'DRAW_NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json({ episodes });
  } catch {
    return NextResponse.json({ error: 'FETCH_FAILED' }, { status: 502 });
  }
}
