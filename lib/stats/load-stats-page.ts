import { computeStatsBundle } from '@/lib/core/stats/compute-bundle';
import { parseStatsWindow, sliceDrawsByWindow, type StatsWindow } from '@/lib/core/stats/window';
import { getCachedStatsDraws } from '@/lib/lotto/cached-stats-draws';

export async function loadStatsPageData(windowParam?: string | string[]) {
  const payload = await getCachedStatsDraws();
  if (!payload) return null;

  const window = parseStatsWindow(windowParam);
  const draws = sliceDrawsByWindow(payload.draws, window);
  if (!draws.length) return null;

  return {
    window,
    allDrawCount: payload.draws.length,
    range: {
      from: payload.fromDrwNo,
      to: payload.toDrwNo,
    },
    bundle: computeStatsBundle(draws),
  };
}

export function windowQuery(window: StatsWindow): string {
  return window === 100 ? '' : `?window=${window}`;
}
