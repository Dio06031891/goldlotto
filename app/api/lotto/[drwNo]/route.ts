import { NextResponse } from 'next/server';
import { fetchDrawByDrwNo } from '@/lib/lotto/upstream-lt645';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { drwNo: string } }
) {
  const { drwNo: raw } = params;
  const drwNo = parseInt(raw, 10);
  if (!Number.isFinite(drwNo) || drwNo < 1) {
    return NextResponse.json({ error: 'INVALID_DRW_NO' }, { status: 400 });
  }

  try {
    const normalized = await fetchDrawByDrwNo(drwNo);
    if (!normalized) {
      return NextResponse.json({ error: 'DRAW_NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json({ error: 'FETCH_FAILED' }, { status: 502 });
  }
}
