/**
 * 원 단위 정수를 한국 화폐 포맷으로
 * @example formatKRW(1_234_567) → "1,234,567원"
 */
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 큰 금액을 한국식 단위로 표시
 */
export function formatKoreanAmount(amount: number): string {
  if (amount < 10_000) return `${amount.toLocaleString('ko-KR')}원`;

  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  const won = amount % 10_000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (won > 0) parts.push(`${won.toLocaleString('ko-KR')}`);

  return parts.join(' ') + '원';
}

/** 입력 문자열을 정수 원으로 (숫자만 추출) */
export function parseKRW(input: string): number {
  const cleaned = input.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
