import { unstable_cache } from 'next/cache';
import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { fetchDrawByDrwNo } from '@/lib/lotto/upstream-lt645';

async function loadDrawByNo(drwNo: number): Promise<DhLotteryDrawJson | null> {
  if (!Number.isInteger(drwNo) || drwNo < 1) return null;
  try {
    return await fetchDrawByDrwNo(drwNo, { retries: 3 });
  } catch {
    return null;
  }
}

/** 회차 상세 페이지·메타데이터용 — 24시간 캐시 */
export function getCachedDrawByNo(drwNo: number): Promise<DhLotteryDrawJson | null> {
  return unstable_cache(
    () => loadDrawByNo(drwNo),
    ['lotto-draw-by-no', String(drwNo)],
    { revalidate: 86_400 }
  )();
}
