import type { StatDraw } from '@/lib/core/stats/calculator';

/** 0 = API에서 받은 전체 구간 */
export type StatsWindow = 0 | 20 | 50 | 100;

export const STATS_WINDOW_OPTIONS: { value: StatsWindow; label: string }[] = [
  { value: 20, label: '최근 20회' },
  { value: 50, label: '최근 50회' },
  { value: 100, label: '최근 100회' },
  { value: 0, label: '전체' },
];

export function parseStatsWindow(raw: string | string[] | undefined): StatsWindow {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = v ? parseInt(v, 10) : 100;
  if (n === 0 || n === 20 || n === 50) return n;
  return 100;
}

export function sliceDrawsByWindow(draws: StatDraw[], window: StatsWindow): StatDraw[] {
  if (window === 0 || draws.length <= window) return draws;
  return draws.slice(-window);
}
