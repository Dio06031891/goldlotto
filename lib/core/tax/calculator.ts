/**
 * 로또 6/45 세금 계산 (2025~2026년 기준)
 *
 * - 200만원 이하: 비과세
 * - 200만 초과 ~ 3억 이하: 22%
 * - 3억 초과분: 33%
 * - 복권 구입비 1,000원 차감 후 과세
 * - 10원 미만 절사
 */
export function calcTax(prize: number): number {
  if (prize < 0) throw new Error('당첨금은 0 이상이어야 합니다');
  if (!Number.isInteger(prize)) throw new Error('당첨금은 정수여야 합니다');

  const base = prize - 1000;
  if (base <= 2_000_000) return 0;

  let tax: number;
  if (base <= 300_000_000) {
    tax = Math.floor((base * 22) / 100);
  } else {
    tax =
      Math.floor((300_000_000 * 22) / 100) +
      Math.floor(((base - 300_000_000) * 33) / 100);
  }
  return Math.floor(tax / 10) * 10;
}

export function afterTax(prize: number): number {
  return prize - calcTax(prize);
}

/** 등수별 참고 프리셋 (원, 정수) */
export const PRIZE_PRESETS = {
  rank5: 5_000,
  rank4: 50_000,
  rank3: 1_500_000,
  rank2: 50_000_000,
  rank1Average: 1_800_000_000,
  rank1High: 2_500_000_000,
} as const;
