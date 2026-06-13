import { describe, expect, it } from 'vitest';
import { daysUntilNextSaturdayDraw, formatYmdKorean } from './draw-format';

describe('formatYmdKorean', () => {
  it('formats ISO date', () => {
    expect(formatYmdKorean('2025-11-22')).toBe('2025년 11월 22일');
  });
});

describe('daysUntilNextSaturdayDraw', () => {
  it('returns 0 on Saturday KST', () => {
    const sat = new Date('2025-11-22T12:00:00+09:00');
    expect(daysUntilNextSaturdayDraw(sat)).toBe(0);
  });

  it('returns 1 on Friday KST', () => {
    const fri = new Date('2025-11-21T12:00:00+09:00');
    expect(daysUntilNextSaturdayDraw(fri)).toBe(1);
  });
});
