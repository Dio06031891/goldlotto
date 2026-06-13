import { CATEGORY_META } from '@/lib/core/spending/categories';
import type { SpendingCategory, SpendingItem, SpendingPlan } from '@/lib/types/spending';

export interface PlanTotals {
  spent: number;
  remaining: number;
  isOverBudget: boolean;
}

export function sumItemAmounts(items: SpendingItem[]): number {
  return items.reduce((sum, i) => sum + i.amount, 0);
}

export function planTotals(plan: Pick<SpendingPlan, 'totalAmount' | 'items'>): PlanTotals {
  const spent = sumItemAmounts(plan.items);
  const remaining = plan.totalAmount - spent;
  return { spent, remaining, isOverBudget: remaining < 0 };
}

export interface ChartSegment {
  category: SpendingCategory;
  label: string;
  amount: number;
  color: string;
}

const CHART_COLORS: Record<SpendingCategory, string> = {
  housing: '#2563eb',
  vehicle: '#0ea5e9',
  wishlist: '#e6b800',
  finance: '#8b5cf6',
  realEstate: '#64748b',
  donation: '#f472b6',
  reserve: '#22c55e',
};

/** 도넛 차트용 — 카테고리별 합산 + 남은 금액(여유자금) */
export function chartSegments(plan: Pick<SpendingPlan, 'totalAmount' | 'items'>): ChartSegment[] {
  const byCategory = new Map<SpendingCategory, number>();

  for (const item of plan.items) {
    if (item.amount <= 0) continue;
    byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + item.amount);
  }

  const segments: ChartSegment[] = [];
  for (const [category, amount] of Array.from(byCategory.entries())) {
    if (category === 'reserve') continue;
    segments.push({
      category,
      label: CATEGORY_META[category].label,
      amount,
      color: CHART_COLORS[category],
    });
  }

  const { remaining } = planTotals(plan);
  if (remaining > 0) {
    segments.push({
      category: 'reserve',
      label: CATEGORY_META.reserve.label,
      amount: remaining,
      color: CHART_COLORS.reserve,
    });
  }

  return segments.sort((a, b) => b.amount - a.amount);
}

export function amountForCategory(items: SpendingItem[], category: SpendingCategory): number {
  return items
    .filter((i) => i.category === category)
    .reduce((sum, i) => sum + i.amount, 0);
}

export function wishlistItems(items: SpendingItem[]): SpendingItem[] {
  return items.filter((i) => i.category === 'wishlist');
}

export function percentOfTotal(amount: number, total: number): number {
  if (total <= 0) return 0;
  return (amount / total) * 100;
}

export function segmentsWithPercent(
  segments: ChartSegment[],
  baseTotal: number
): Array<ChartSegment & { percent: number }> {
  return segments.map((s) => ({
    ...s,
    percent: percentOfTotal(s.amount, baseTotal),
  }));
}
