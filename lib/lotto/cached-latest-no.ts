import { unstable_cache } from 'next/cache';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';
import { getLatestDrawHintDrwNo } from '@/lib/lotto/latest-draw-hint';
import { fetchDrawByDrwNo } from '@/lib/lotto/upstream-lt645';

async function resolveLatestDrwNo(): Promise<number | null> {
  const draw = await getCachedLatestDraw();
  if (draw?.drwNo) return draw.drwNo;

  const hint = getLatestDrawHintDrwNo();
  for (let n = hint; n >= hint - 8 && n >= 1; n--) {
    try {
      const row = await fetchDrawByDrwNo(n, { retries: 1 });
      if (row) return row.drwNo;
    } catch {
      /* skip */
    }
  }
  return null;
}

export const getCachedLatestDrwNo = unstable_cache(
  resolveLatestDrwNo,
  ['lotto-latest-drw-no-v1'],
  { revalidate: 3600 }
);
