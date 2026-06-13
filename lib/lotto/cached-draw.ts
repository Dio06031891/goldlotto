import { unstable_cache } from 'next/cache';
import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { fetchLatestDrawWithFallback } from '@/lib/lotto/upstream-lt645';

/** 서버 컴포넌트·API 공용 — 5분 캐시 */
export const getCachedLatestDraw = unstable_cache(
  async (): Promise<DhLotteryDrawJson | null> => fetchLatestDrawWithFallback(),
  ['lotto-latest-draw-v3'],
  { revalidate: 120 }
);
