import {
  bonusFrequencyByNumber,
  coldNumbers,
  consecutiveDrawDistribution,
  endingDigitDistribution,
  frequencyByNumber,
  frequencyTable,
  hotNumbers,
  lowHighSummary,
  oddEvenSummary,
  sumHistogram,
  topPairs,
  zoneFrequency,
  type StatDraw,
} from '@/lib/core/stats/calculator';

export function computeStatsBundle(draws: StatDraw[]) {
  const freq = frequencyByNumber(draws);
  const bonusFreq = bonusFrequencyByNumber(draws);
  const maxMain = Math.max(...frequencyTable(freq).map((r) => r.count), 1);

  return {
    drawCount: draws.length,
    fromDrwNo: draws[0]?.drwNo ?? null,
    toDrwNo: draws[draws.length - 1]?.drwNo ?? null,
    freq,
    maxMain,
    table: frequencyTable(freq),
    hot: hotNumbers(freq, 10),
    cold: coldNumbers(freq, 10),
    bonusHot: hotNumbers(bonusFreq, 5),
    oddEven: oddEvenSummary(draws),
    lowHigh: lowHighSummary(draws),
    zones: zoneFrequency(draws),
    sums: sumHistogram(draws),
    consecutive: consecutiveDrawDistribution(draws),
    endings: endingDigitDistribution(draws),
    pairs: topPairs(draws, 12),
  };
}

export type StatsBundle = ReturnType<typeof computeStatsBundle>;
