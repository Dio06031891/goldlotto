import { describe, expect, it } from 'vitest';
import { formatKRW, formatKoreanAmount, parseKRW } from './currency';

describe('formatKRW', () => {
  it('천 단위 콤마', () => {
    expect(formatKRW(1_234_567)).toBe('1,234,567원');
    expect(formatKRW(0)).toBe('0원');
  });
});

describe('formatKoreanAmount', () => {
  it('1만 미만', () => {
    expect(formatKoreanAmount(9_999)).toMatch(/원$/);
  });

  it('억·만 혼합', () => {
    expect(formatKoreanAmount(1_200_000_000)).toContain('억');
  });
});

describe('parseKRW', () => {
  it('콤마·문자 제거', () => {
    expect(parseKRW('1,800,000,000')).toBe(1_800_000_000);
    expect(parseKRW('')).toBe(0);
    expect(parseKRW('abc')).toBe(0);
  });
});
