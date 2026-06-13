import { unstable_cache } from 'next/cache';
import {
  parsePstLt645AllListSchedule,
  type LottoEpisodeSchedule,
} from '@/lib/lotto/dhlottery-types';
import {
  buildRecentEpisodesFallback,
  fetchPstLt645Raw,
  parseLt645Json,
} from '@/lib/lotto/upstream-lt645';

async function loadScheduleEpisodes(): Promise<LottoEpisodeSchedule[] | null> {
  try {
    const { ok, text } = await fetchPstLt645Raw('all');
    if (ok) {
      try {
        const episodes = parsePstLt645AllListSchedule(parseLt645Json(text));
        if (episodes?.length) return episodes;
      } catch {
        /* fall through */
      }
    }
  } catch {
    /* fall through */
  }

  try {
    return await buildRecentEpisodesFallback(100);
  } catch {
    return null;
  }
}

/** 추첨일 선택 드롭다운용 — 1시간 캐시 */
export const getCachedSchedule = unstable_cache(
  loadScheduleEpisodes,
  ['lotto-schedule-v2'],
  { revalidate: 3600 }
);
