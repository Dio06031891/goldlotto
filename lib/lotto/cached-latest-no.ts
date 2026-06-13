import { unstable_cache } from 'next/cache';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';
import { estimateMaxDrwNo, findLatestDrwNoFast } from '@/lib/lotto/upstream-lt645';

async function resolveLatestDrwNo(): Promise<number | null> {
  const draw = await getCachedLatestDraw();
  if (draw?.drwNo) return draw.drwNo;
  try {
    return await findLatestDrwNoFast(estimateMaxDrwNo());
  } catch {
    return null;
  }
}

export const getCachedLatestDrwNo = unstable_cache(
  resolveLatestDrwNo,
  ['lotto-latest-drw-no-v1'],
  { revalidate: 3600 }
);
