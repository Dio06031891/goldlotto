import { describe, expect, it } from 'vitest';
import {
  buildFrequencyWeights,
  frequencyByNumber,
  hotNumbers,
  scoreCombination,
} from './frequency';

describe('frequency', () => {
  const draws = [
    { numbers: [1, 2, 3, 4, 5, 6] as const },
    { numbers: [1, 2, 7, 8, 9, 10] as const },
    { numbers: [1, 11, 12, 13, 14, 15] as const },
  ];

  it('counts appearances', () => {
    const freq = frequencyByNumber(draws);
    expect(freq.get(1)).toBe(3);
    expect(freq.get(6)).toBe(1);
  });

  it('hot numbers ordered', () => {
    const freq = frequencyByNumber(draws);
    expect(hotNumbers(freq, 3)[0]).toBe(1);
  });

  it('scores higher for frequent numbers', () => {
    const weights = buildFrequencyWeights(frequencyByNumber(draws));
    const high = scoreCombination([1, 2, 3, 4, 5, 6], weights);
    const low = scoreCombination([40, 41, 42, 43, 44, 45], weights);
    expect(high).toBeGreaterThan(low);
  });
});
