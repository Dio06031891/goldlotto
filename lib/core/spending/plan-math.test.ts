import { describe, expect, it } from 'vitest';
import {
  chartSegments,
  percentOfTotal,
  planTotals,
  segmentsWithPercent,
  sumItemAmounts,
} from './plan-math';
import type { SpendingPlan } from '@/lib/types/spending';

const basePlan: SpendingPlan = {
  id: '1',
  name: '테스트',
  totalAmount: 1_300_000_000,
  items: [
    { id: 'a', category: 'housing', name: '주거', amount: 700_000_000 },
    { id: 'b', category: 'vehicle', name: '이동', amount: 100_000_000 },
  ],
  createdAt: '',
  updatedAt: '',
};

describe('planTotals', () => {
  it('computes spent and remaining', () => {
    expect(planTotals(basePlan)).toEqual({
      spent: 800_000_000,
      remaining: 500_000_000,
      isOverBudget: false,
    });
  });

  it('flags over budget', () => {
    const over = {
      ...basePlan,
      items: [...basePlan.items, { id: 'c', category: 'finance', name: '금융', amount: 600_000_000 }],
    };
    expect(planTotals(over).isOverBudget).toBe(true);
    expect(planTotals(over).remaining).toBe(-100_000_000);
  });
});

describe('chartSegments', () => {
  it('includes reserve slice when under budget', () => {
    const segments = chartSegments(basePlan);
    expect(sumItemAmounts(basePlan.items)).toBe(800_000_000);
    const reserve = segments.find((s) => s.category === 'reserve');
    expect(reserve?.amount).toBe(500_000_000);
  });
});

describe('segmentsWithPercent', () => {
  it('computes percent against base total', () => {
    const segs = segmentsWithPercent(
      [{ category: 'housing', label: '주거', amount: 100, color: '#000' }],
      200
    );
    expect(segs[0].percent).toBe(50);
    expect(percentOfTotal(650_000_000, 1_300_000_000)).toBeCloseTo(50, 0);
  });
});
