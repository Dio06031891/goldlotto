import {
  frequencyByNumber,
  hotNumbers,
  type FrequencyWeights,
} from '@/lib/core/stats/frequency';

export type StatDraw = {
  drwNo: number;
  numbers?: [number, number, number, number, number, number];
  bonus?: number;
};

export { frequencyByNumber, hotNumbers, type FrequencyWeights };

export function coldNumbers(freq: Map<number, number>, top = 10): number[] {
  return Array.from(freq.entries())
    .filter(([n]) => n >= 1 && n <= 45)
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
    .slice(0, top)
    .map(([n]) => n);
}

export function bonusFrequencyByNumber(draws: StatDraw[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (let n = 1; n <= 45; n++) freq.set(n, 0);
  for (const d of draws) {
    const b = d.bonus;
    if (b !== undefined && b >= 1 && b <= 45) {
      freq.set(b, (freq.get(b) ?? 0) + 1);
    }
  }
  return freq;
}

export function oddEvenSummary(draws: StatDraw[]): { odd: number; even: number } {
  let odd = 0;
  let even = 0;
  for (const d of draws) {
    if (!d.numbers) continue;
    for (const n of d.numbers) {
      if (n % 2 === 1) odd++;
      else even++;
    }
  }
  return { odd, even };
}

/** 1~22 저, 23~45 고 */
export function lowHighSummary(draws: StatDraw[]): { low: number; high: number } {
  let low = 0;
  let high = 0;
  for (const d of draws) {
    if (!d.numbers) continue;
    for (const n of d.numbers) {
      if (n <= 22) low++;
      else high++;
    }
  }
  return { low, high };
}

export function zoneFrequency(draws: StatDraw[]): { zone: string; count: number }[] {
  const zones = [
    { zone: '1~10', min: 1, max: 10 },
    { zone: '11~20', min: 11, max: 20 },
    { zone: '21~30', min: 21, max: 30 },
    { zone: '31~40', min: 31, max: 40 },
    { zone: '41~45', min: 41, max: 45 },
  ];
  const counts = zones.map(() => 0);
  for (const d of draws) {
    if (!d.numbers) continue;
    for (const n of d.numbers) {
      const zi = zones.findIndex((z) => n >= z.min && n <= z.max);
      if (zi >= 0) counts[zi]++;
    }
  }
  return zones.map((z, i) => ({ zone: z.zone, count: counts[i] }));
}

export function sumHistogram(
  draws: StatDraw[]
): { bucket: string; count: number; min: number }[] {
  const bucketSize = 10;
  const minSum = 90;
  const maxSum = 200;
  const buckets: { bucket: string; count: number; min: number }[] = [];
  for (let start = minSum; start <= maxSum; start += bucketSize) {
    const end = start + bucketSize - 1;
    buckets.push({
      bucket: `${start}~${end}`,
      count: 0,
      min: start,
    });
  }
  for (const d of draws) {
    if (!d.numbers) continue;
    const sum = d.numbers.reduce((a, b) => a + b, 0);
    const idx = Math.floor((sum - minSum) / bucketSize);
    if (idx >= 0 && idx < buckets.length) buckets[idx].count++;
  }
  return buckets.filter((b) => b.count > 0 || b.min >= 100 && b.min <= 170);
}

export function consecutiveDrawDistribution(
  draws: StatDraw[]
): { label: string; count: number }[] {
  const counts = { none: 0, one: 0, twoPlus: 0 };
  for (const d of draws) {
    if (!d.numbers) continue;
    const sorted = [...d.numbers].sort((a, b) => a - b);
    let pairs = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) pairs++;
    }
    if (pairs === 0) counts.none++;
    else if (pairs === 1) counts.one++;
    else counts.twoPlus++;
  }
  return [
    { label: '연속 없음', count: counts.none },
    { label: '연속 1쌍', count: counts.one },
    { label: '연속 2쌍+', count: counts.twoPlus },
  ];
}

export function endingDigitDistribution(
  draws: StatDraw[]
): { digit: string; count: number }[] {
  const freq = Array.from({ length: 10 }, () => 0);
  for (const d of draws) {
    if (!d.numbers) continue;
    for (const n of d.numbers) {
      freq[n % 10]++;
    }
  }
  return freq.map((count, digit) => ({ digit: String(digit), count }));
}

export function topPairs(
  draws: StatDraw[],
  top = 10
): { pair: string; count: number }[] {
  const map = new Map<string, number>();
  for (const d of draws) {
    if (!d.numbers) continue;
    const nums = [...d.numbers].sort((a, b) => a - b);
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const key = `${nums[i]}-${nums[j]}`;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([pair, count]) => ({ pair, count }));
}

export type NumberDetailStats = {
  mainCount: number;
  bonusCount: number;
  totalAppearances: number;
  lastSeenDrwNo: number | null;
  avgGap: number | null;
};

export function numberDetailStats(draws: StatDraw[], num: number): NumberDetailStats {
  const appearances: number[] = [];
  let bonusCount = 0;

  for (const d of draws) {
    if (d.bonus === num) bonusCount++;
    if (d.numbers?.some((x) => x === num)) {
      appearances.push(d.drwNo);
    }
  }

  let avgGap: number | null = null;
  if (appearances.length >= 2) {
    let gapSum = 0;
    for (let i = 1; i < appearances.length; i++) {
      gapSum += appearances[i] - appearances[i - 1];
    }
    avgGap = Math.round((gapSum / (appearances.length - 1)) * 10) / 10;
  }

  return {
    mainCount: appearances.length,
    bonusCount,
    totalAppearances: appearances.length + bonusCount,
    lastSeenDrwNo: appearances.length ? appearances[appearances.length - 1] : null,
    avgGap,
  };
}

export function frequencyTable(freq: Map<number, number>): { n: number; count: number }[] {
  return Array.from({ length: 45 }, (_, i) => {
    const n = i + 1;
    return { n, count: freq.get(n) ?? 0 };
  });
}
