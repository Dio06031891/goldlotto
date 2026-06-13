import { describe, expect, it } from 'vitest';
import { buildFrequencyWeights } from '@/lib/core/stats/frequency';
import {
  generateLottoNumberSets,
  generateLottoNumbers,
  isDiverseFromSelected,
  passesValidation,
  validateFixedNumbers,
} from './lotto-generator';

describe('generateLottoNumbers', () => {
  it('전체 자동: 6개 생성', () => {
    const nums = generateLottoNumbers();
    expect(nums).toHaveLength(6);
    expect(new Set(nums).size).toBe(6);
    expect(nums.every((n) => n >= 1 && n <= 45)).toBe(true);
    expect([...nums].sort((a, b) => a - b)).toEqual(nums);
    expect(passesValidation(nums)).toBe(true);
  });

  it('1개 고정', () => {
    const nums = generateLottoNumbers({ fixedNumbers: [7] });
    expect(nums).toContain(7);
    expect(nums).toHaveLength(6);
    expect(passesValidation(nums)).toBe(true);
  });

  it('3개 고정', () => {
    const nums = generateLottoNumbers({ fixedNumbers: [1, 15, 30] });
    expect(nums).toContain(1);
    expect(nums).toContain(15);
    expect(nums).toContain(30);
    expect(passesValidation(nums)).toBe(true);
  });

  it('검증 규칙 통과: 100번 생성해도 모두 통과', () => {
    for (let i = 0; i < 100; i++) {
      const nums = generateLottoNumbers();
      const odd = nums.filter((n) => n % 2 === 1).length;
      expect(odd).toBeGreaterThanOrEqual(2);
      expect(odd).toBeLessThanOrEqual(4);

      const low = nums.filter((n) => n <= 22).length;
      expect(low).toBeGreaterThanOrEqual(2);
      expect(low).toBeLessThanOrEqual(4);

      const sum = nums.reduce((a, b) => a + b, 0);
      expect(sum).toBeGreaterThanOrEqual(100);
      expect(sum).toBeLessThanOrEqual(175);
      expect(passesValidation(nums)).toBe(true);
    }
  });

  it('5세트 생성', () => {
    const sets = generateLottoNumberSets({ count: 5 });
    expect(sets).toHaveLength(5);
    for (const nums of sets) {
      expect(passesValidation(nums)).toBe(true);
    }
  });

  it('재생성 시 이전과 동일한 5세트는 제외', () => {
    const freq = new Map<number, number>();
    for (let n = 1; n <= 45; n++) freq.set(n, 5);
    const weights = buildFrequencyWeights(freq);
    const first = generateLottoNumberSets({
      useStatistics: true,
      frequencyWeights: weights,
      count: 5,
    });
    const second = generateLottoNumberSets({
      useStatistics: true,
      frequencyWeights: weights,
      count: 5,
      excludeSets: first,
    });
    const firstKeys = new Set(first.map((s) => s.join(',')));
    const overlap = second.filter((s) => firstKeys.has(s.join(','))).length;
    expect(overlap).toBe(0);
  });

  it('5세트는 서로 최대 3개 번호만 겹침', () => {
    const sets = generateLottoNumberSets({ count: 5 });
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        expect(isDiverseFromSelected(sets[i], [sets[j]], 3)).toBe(true);
      }
    }
  });

  it('통계 가중 시 1번이 거의 항상 포함 (극단 가중)', () => {
    const freq = new Map<number, number>();
    for (let n = 1; n <= 45; n++) freq.set(n, n === 1 ? 100 : 0);
    const weights = buildFrequencyWeights(freq);
    let withOne = 0;
    for (let i = 0; i < 30; i++) {
      const nums = generateLottoNumbers({
        fixedNumbers: [],
        useStatistics: true,
        frequencyWeights: weights,
      });
      if (nums.includes(1)) withOne++;
    }
    expect(withOne).toBeGreaterThan(20);
  });

  it('잘못된 입력 거부', () => {
    expect(() => generateLottoNumbers({ fixedNumbers: [1, 2, 3, 4, 5, 6] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [0] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [46] })).toThrow();
    expect(() => generateLottoNumbers({ fixedNumbers: [1, 1, 2] })).toThrow();
    expect(() => validateFixedNumbers([1, 1])).toThrow();
  });
});
