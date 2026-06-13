import { describe, it, expect } from 'vitest';
import {
  coldNumbers,
  consecutiveDrawDistribution,
  frequencyByNumber,
  hotNumbers,
  lowHighSummary,
  numberDetailStats,
  oddEvenSummary,
  topPairs,
  zoneFrequency,
} from '@/lib/core/stats/calculator';
import type { StatDraw } from '@/lib/core/stats/calculator';
import { sliceDrawsByWindow } from '@/lib/core/stats/window';

const draws: StatDraw[] = [
  { drwNo: 1, numbers: [1, 2, 3, 4, 5, 6], bonus: 7 },
  { drwNo: 2, numbers: [1, 3, 5, 7, 9, 11], bonus: 2 },
  { drwNo: 3, numbers: [10, 20, 30, 40, 41, 45], bonus: 1 },
];

describe('stats calculator', () => {
  it('frequency and hot/cold', () => {
    const freq = frequencyByNumber(draws);
    expect(freq.get(1)).toBe(2);
    expect(hotNumbers(freq, 3)[0]).toBe(1);
    expect(coldNumbers(freq, 3).length).toBe(3);
  });

  it('odd/even and low/high', () => {
    expect(oddEvenSummary(draws).odd).toBeGreaterThan(0);
    expect(lowHighSummary(draws).low).toBeGreaterThan(0);
  });

  it('zone frequency has five zones', () => {
    expect(zoneFrequency(draws)).toHaveLength(5);
  });

  it('consecutive distribution sums to draw count with numbers', () => {
    const dist = consecutiveDrawDistribution(draws);
    const total = dist.reduce((s, d) => s + d.count, 0);
    expect(total).toBe(3);
  });

  it('number detail tracks appearances', () => {
    const d = numberDetailStats(draws, 1);
    expect(d.mainCount).toBe(2);
    expect(d.bonusCount).toBe(1);
    expect(d.lastSeenDrwNo).toBe(2);
  });

  it('top pairs includes frequent pair', () => {
    const pairs = topPairs(draws, 5);
    expect(pairs[0].count).toBeGreaterThanOrEqual(1);
  });

  it('sliceDrawsByWindow keeps last N', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      drwNo: i + 1,
      numbers: [1, 2, 3, 4, 5, 6] as [number, number, number, number, number, number],
    }));
    expect(sliceDrawsByWindow(many, 20)).toHaveLength(20);
    expect(sliceDrawsByWindow(many, 20)[0].drwNo).toBe(11);
  });
});
