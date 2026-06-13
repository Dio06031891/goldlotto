import { unstable_cache } from 'next/cache';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';
import { getLatestDrwNoFromDisk } from '@/lib/lotto/latest-draw-hint';
import { isNextProductionBuild } from '@/lib/lotto/is-production-build';
import { fetchDrawByDrwNo } from '@/lib/lotto/upstream-lt645';

async function resolveLatestDrwNo(): Promise<number | null> {
  const draw = await getCachedLatestDraw();
  if (draw?.drwNo) return draw.drwNo;

  const disk = getLatestDrwNoFromDisk();
  if (isNextProductionBuild()) return disk;

  for (let n = disk; n >= disk - 3 && n >= 1; n--) {
    try {
      const row = await fetchDrawByDrwNo(n, { retries: 1 });
      if (row) return row.drwNo;
    } catch {
      /* skip */
    }
  }
  return disk;
}

export const getCachedLatestDrwNo = unstable_cache(
  resolveLatestDrwNo,
  ['lotto-latest-drw-no-v2'],
  { revalidate: 3600 }
);
