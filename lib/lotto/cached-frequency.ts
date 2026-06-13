import { unstable_cache } from 'next/cache';
import {
  buildFrequencyWeights,
  frequencyByNumber,
  hotNumbers,
  weightsToRecord,
} from '@/lib/core/stats/frequency';
import { sliceDrawsByWindow } from '@/lib/core/stats/window';
import { getCachedStatsDraws } from '@/lib/lotto/cached-stats-draws';

const STAT_DRAW_COUNT = 100;

export type LottoFrequencyPayload = {
  drawCount: number;
  fromDrwNo: number | null;
  toDrwNo: number | null;
  weights: Record<string, number>;
  hot: number[];
};

async function loadFrequencyPayload(): Promise<LottoFrequencyPayload | null> {
  try {
    const payload = await getCachedStatsDraws();
    if (!payload?.draws.length) return null;

    const draws = sliceDrawsByWindow(payload.draws, STAT_DRAW_COUNT);
    const freq = frequencyByNumber(draws);
    const weights = buildFrequencyWeights(freq);
    return {
      drawCount: draws.length,
      fromDrwNo: draws[0]?.drwNo ?? null,
      toDrwNo: draws[draws.length - 1]?.drwNo ?? null,
      weights: weightsToRecord(weights),
      hot: hotNumbers(freq, 10),
    };
  } catch {
    return null;
  }
}

export const getCachedFrequency = unstable_cache(
  loadFrequencyPayload,
  ['lotto-frequency-v2', String(STAT_DRAW_COUNT)],
  { revalidate: 3600 }
);
