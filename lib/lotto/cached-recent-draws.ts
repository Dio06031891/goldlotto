import { unstable_cache } from 'next/cache';
import {
  parsePstLt645AllListDraws,
  type DhLotteryDrawJson,
} from '@/lib/lotto/dhlottery-types';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';
import { isNextProductionBuild } from '@/lib/lotto/is-production-build';
import { loadLatestDrawSnapshot } from '@/lib/lotto/latest-draw-snapshot';
import {
  fetchDrawByDrwNo,
  fetchPstLt645Raw,
  parseLt645Json,
} from '@/lib/lotto/upstream-lt645';

async function loadRecentDraws(limit: number): Promise<DhLotteryDrawJson[]> {
  const cap = Math.min(20, Math.max(1, limit));

  if (isNextProductionBuild()) {
    const snap = loadLatestDrawSnapshot();
    return snap?.numbers?.length === 6 ? [snap] : [];
  }

  try {
    const { ok, text } = await fetchPstLt645Raw('all');
    if (ok) {
      const draws = parsePstLt645AllListDraws(parseLt645Json(text), cap);
      if (draws?.length) return [...draws].reverse();
    }
  } catch {
    /* fallback */
  }

  const latest = await getCachedLatestDraw();
  if (!latest) return [];

  const out: DhLotteryDrawJson[] = [latest];
  for (let n = latest.drwNo - 1; n >= 1 && out.length < cap; n--) {
    try {
      const row = await fetchDrawByDrwNo(n, { retries: 1 });
      if (row?.numbers) out.push(row);
    } catch {
      /* skip */
    }
  }
  return out;
}

/** 홈 최근 N회 미리보기 — 1시간 캐시 */
export function getCachedRecentDraws(limit = 5): Promise<DhLotteryDrawJson[]> {
  return unstable_cache(
    () => loadRecentDraws(limit),
    ['lotto-recent-draws', String(limit)],
    { revalidate: 3600 }
  )();
}
