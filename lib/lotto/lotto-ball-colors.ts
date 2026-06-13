/** 로또 6/45 공식 구간 색 */
export function lottoBallColor(num: number): string {
  if (num <= 10) return '#fbc400';
  if (num <= 20) return '#69c8f2';
  if (num <= 30) return '#ff7272';
  if (num <= 40) return '#aaaaaa';
  return '#b0d840';
}
