import { NextResponse } from 'next/server';
import { searchStores } from '@/lib/stores/store-repository';
import { toPublicStores } from '@/lib/stores/store-public';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? undefined;
  const sido = url.searchParams.get('sido') ?? undefined;
  const sigungu = url.searchParams.get('sigungu') ?? undefined;
  const lat = parseFloat(url.searchParams.get('lat') ?? '');
  const lng = parseFloat(url.searchParams.get('lng') ?? '');
  const radiusKm = parseFloat(url.searchParams.get('radiusKm') ?? '5');
  const luckOnly = url.searchParams.get('luckOnly') === '1';
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);

  const stores = searchStores({
    q,
    sidoSlug: sido,
    sigunguSlug: sigungu,
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined,
    radiusKm: Number.isFinite(radiusKm) ? radiusKm : 5,
    luckOnly,
    limit: Number.isFinite(limit) ? Math.min(100, limit) : 50,
  });

  return NextResponse.json({
    count: stores.length,
    stores: toPublicStores(stores),
  });
}
