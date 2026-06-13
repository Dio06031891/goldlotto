import type { LottoEpisodeSchedule } from './dhlottery-types';

/**
 * 달력에서 고른 날짜가 속한 주(월요일~일요일, 로컬)에 추첨일이 들어오는 회차.
 * 추첨일이 선택일과 같으면 그 회차를 우선합니다.
 * 같은 주에 복수 회차가 있으면 추첨일·회차 번호가 가장 늦은 것을 택합니다.
 */
export function findEpisodeInCalendarWeek(
  episodes: readonly LottoEpisodeSchedule[],
  selectedYmd: string
): LottoEpisodeSchedule | null {
  if (!episodes.length) return null;

  const exact = episodes.find((e) => e.drwNoDate === selectedYmd);
  if (exact) return exact;

  const parts = selectedYmd.split('-').map((x) => parseInt(x, 10));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts;
  const sel = new Date(y, m - 1, d);
  const dow = sel.getDay();
  const toMon = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(sel);
  mon.setDate(sel.getDate() + toMon);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const pad = (n: number) => String(n).padStart(2, '0');
  const monStr = `${mon.getFullYear()}-${pad(mon.getMonth() + 1)}-${pad(mon.getDate())}`;
  const sunStr = `${sun.getFullYear()}-${pad(sun.getMonth() + 1)}-${pad(sun.getDate())}`;

  const inWeek = episodes.filter(
    (e) => e.drwNoDate >= monStr && e.drwNoDate <= sunStr
  );
  if (inWeek.length === 0) return null;

  inWeek.sort((a, b) => {
    const c = a.drwNoDate.localeCompare(b.drwNoDate);
    return c !== 0 ? c : a.drwNo - b.drwNo;
  });
  return inWeek[inWeek.length - 1];
}
