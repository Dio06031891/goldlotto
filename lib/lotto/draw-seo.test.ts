import { describe, it, expect } from 'vitest';
import { drawPageDescription, drawPageTitle } from '@/lib/lotto/draw-seo';
import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';

const sample: DhLotteryDrawJson = {
  returnValue: 'success',
  drwNo: 100,
  drwNoDate: '2024-01-06',
  numbers: [3, 12, 23, 28, 35, 42],
  bonus: 7,
  firstWinnerCount: 12,
  firstWinamnt: 2_000_000_000,
  secondWinamnt: 50_000_000,
  thirdWinamnt: 1_500_000,
  fourthWinamnt: 50_000,
  fifthWinamnt: 5_000,
};

describe('draw-seo', () => {
  it('builds title with sorted numbers and bonus', () => {
    expect(drawPageTitle(sample)).toBe(
      '로또 100회 당첨번호 3,12,23,28,35,42+7'
    );
  });

  it('builds description with date and prize', () => {
    expect(drawPageDescription(sample)).toContain('2024년 1월 6일');
    expect(drawPageDescription(sample)).toContain('100회');
    expect(drawPageDescription(sample)).toContain('12명');
  });
});
