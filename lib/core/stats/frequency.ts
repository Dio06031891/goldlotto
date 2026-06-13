import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';

export type FrequencyWeights = Map<number, number>;

export function frequencyByNumber(draws: Pick<DhLotteryDrawJson, 'numbers'>[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (let n = 1; n <= 45; n++) freq.set(n, 0);
  for (const d of draws) {
    if (!d.numbers) continue;
    for (const n of d.numbers) {
      if (n >= 1 && n <= 45) freq.set(n, (freq.get(n) ?? 0) + 1);
    }
  }
  return freq;
}

/** 출현 횟수 + 1 (라플라스) — 가중 추첨용 */
export function buildFrequencyWeights(freq: Map<number, number>): FrequencyWeights {
  const weights = new Map<number, number>();
  for (let n = 1; n <= 45; n++) {
    weights.set(n, (freq.get(n) ?? 0) + 1);
  }
  return weights;
}

export function scoreCombination(nums: number[], weights: FrequencyWeights): number {
  return nums.reduce((sum, n) => sum + (weights.get(n) ?? 1), 0);
}

export function hotNumbers(freq: Map<number, number>, top = 10): number[] {
  return Array.from(freq.entries())
    .filter(([n]) => n >= 1 && n <= 45)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([n]) => n);
}

export function weightsToRecord(weights: FrequencyWeights): Record<string, number> {
  const out: Record<string, number> = {};
  for (let n = 1; n <= 45; n++) {
    out[String(n)] = weights.get(n) ?? 1;
  }
  return out;
}

export function recordToWeights(record: Record<string, number>): FrequencyWeights {
  const weights = new Map<number, number>();
  for (let n = 1; n <= 45; n++) {
    const v = record[String(n)];
    weights.set(n, typeof v === 'number' && v > 0 ? v : 1);
  }
  return weights;
}
