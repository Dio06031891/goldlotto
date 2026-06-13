export function formatYmdKorean(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return ymd;
  const [, y, mo, da] = m;
  return `${y}년 ${parseInt(mo, 10)}월 ${parseInt(da, 10)}일`;
}

/** 다음 토요일 추첨(20:40 KST)까지 남은 일수 (0 = 오늘이 토요일) */
export function daysUntilNextSaturdayDraw(from = new Date()): number {
  const kstDay = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  }).format(from);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const today = map[kstDay] ?? 0;
  if (today === 6) return 0;
  return (6 - today + 7) % 7;
}

export function nextDrawCountdownLabel(from = new Date()): string {
  const days = daysUntilNextSaturdayDraw(from);
  if (days === 0) return '오늘 토요일 추첨 (20:40)';
  return `다음 추첨까지 ${days}일 (토 20:40)`;
}
