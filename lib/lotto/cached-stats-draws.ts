import { unstable_cache } from 'next/cache';
import type { StatDraw } from '@/lib/core/stats/calculator';
import { parsePstLt645AllListDraws } from '@/lib/lotto/dhlottery-types';
import { isNextProductionBuild } from '@/lib/lotto/is-production-build';
import { fetchPstLt645Raw, parseLt645Json } from '@/lib/lotto/upstream-lt645';

export type StatsDrawsPayload = {
  draws: StatDraw[];
  fromDrwNo: number | null;
  toDrwNo: number | null;
};

async function loadStatsDraws(): Promise<StatsDrawsPayload | null> {
  if (isNextProductionBuild()) return null;

  try {
    const { ok, text } = await fetchPstLt645Raw('all');
    if (!ok) return null;
    const rows = parsePstLt645AllListDraws(parseLt645Json(text), 0);
    if (!rows?.length) return null;

    const draws: StatDraw[] = rows
      .filter((d) => d.numbers)
      .map((d) => ({
        drwNo: d.drwNo,
        numbers: d.numbers,
        bonus: d.bonus,
      }));

    return {
      draws,
      fromDrwNo: draws[0]?.drwNo ?? null,
      toDrwNo: draws[draws.length - 1]?.drwNo ?? null,
    };
  } catch {
    return null;
  }
}

/** 통계 페이지 공용 — 1시간 캐시 */
export const getCachedStatsDraws = unstable_cache(
  loadStatsDraws,
  ['lotto-stats-draws-v1'],
  { revalidate: 3600 }
);
