import dns from 'node:dns';
import {
  parsePstLt645AllListLatest,
  parsePstLt645Response,
  type DhLotteryDrawJson,
  type LottoEpisodeSchedule,
} from '@/lib/lotto/dhlottery-types';

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export function pstLt645Url(srchLtEpsd: string | number): string {
  return `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchLtEpsd=${encodeURIComponent(
    String(srchLtEpsd)
  )}&_=${Date.now()}`;
}

const LT645_HEADERS: Record<string, string> = {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'X-Requested-With': 'XMLHttpRequest',
  Referer: 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
  'User-Agent': UA,
};

/**
 * 동행복권 lt645 조회. Node에서 IPv6 경로가 막힐 때가 있어 ipv4first 적용 + 재시도.
 */
export async function fetchPstLt645Raw(
  srchLtEpsd: string | number,
  opts?: { retries?: number }
): Promise<{ ok: boolean; status: number; text: string }> {
  const maxAttempts = opts?.retries ?? 3;
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(pstLt645Url(srchLtEpsd), {
        cache: 'no-store',
        signal: AbortSignal.timeout(55_000),
        headers: LT645_HEADERS,
      });
      const text = await res.text();
      return { ok: res.ok, status: res.status, text };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export function parseLt645Json(text: string): unknown {
  return JSON.parse(text) as unknown;
}

/** `srchLtEpsd=all` 한 번으로 최신 회차(전체 목록 마지막) */
export async function fetchLatestFromAllList(): Promise<DhLotteryDrawJson | null> {
  try {
    const { ok, text } = await fetchPstLt645Raw('all');
    if (!ok) return null;
    try {
      return parsePstLt645AllListLatest(parseLt645Json(text));
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/** 단일 회차 응답 → 정규화 (payload 작음) */
export async function fetchDrawByDrwNo(
  drwNo: number,
  opts?: { retries?: number }
): Promise<DhLotteryDrawJson | null> {
  const { ok, text } = await fetchPstLt645Raw(drwNo, { retries: opts?.retries ?? 3 });
  if (!ok) return null;
  try {
    return parsePstLt645Response(parseLt645Json(text), drwNo);
  } catch {
    return null;
  }
}

/**
 * 존재하는 최대 회차 번호(최신). `all` 실패 시 소형 요청만 반복.
 * 회차 1..N 존재, N+1 미존재 가정으로 이진 탐색.
 */
/**
 * 최신 회차 번호. 이진 탐색 후 위쪽으로 더 있는지 확인(상한만 맞으면 됨).
 * (과거) 낮은 회차에서 +8만 올리던 방식은 500대 회차를 최신으로 오인할 수 있어 제거.
 */
export async function findLatestDrwNoFast(maxHi: number): Promise<number | null> {
  const cap = Math.min(20_000, Math.max(100, maxHi));
  let latest = await findLatestDrwNoBinary(cap);
  if (latest === null) return null;

  for (let n = latest + 1; n <= latest + 24; n++) {
    const row = await fetchDrawByDrwNo(n, { retries: 1 });
    if (row) latest = n;
    else break;
  }
  return latest;
}

export async function findLatestDrwNoBinary(maxHi: number): Promise<number | null> {
  try {
    let lo = 1;
    let hi = Math.min(20_000, Math.max(100, maxHi));
    let best: number | null = null;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const row = await fetchDrawByDrwNo(mid, { retries: 2 });
      if (row) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best;
  } catch {
    return null;
  }
}

/** 1회차(2002-12-07) 이후 주 1회 추첨 기준 추정 상한 */
export function estimateMaxDrwNo(now = Date.now()): number {
  const first = Date.UTC(2002, 11, 7);
  const weeks = Math.floor((now - first) / (7 * 86_400_000));
  return Math.min(20_000, Math.max(1, weeks + 10));
}

export async function fetchLatestDrawWithFallback(): Promise<DhLotteryDrawJson | null> {
  const { loadLatestDrawSnapshot } = await import('@/lib/lotto/latest-draw-snapshot');
  const { getLatestDrawHintDrwNo } = await import('@/lib/lotto/latest-draw-hint');

  // 1) Git 스냅샷 — Vercel에서 API 차단·타임아웃 시 즉시 표시
  const snapshot = loadLatestDrawSnapshot();
  if (snapshot?.numbers?.length === 6) return snapshot;

  // 2) 단일 요청 — all 목록
  try {
    const fromAll = await fetchLatestFromAllList();
    if (fromAll?.numbers?.length === 6) return fromAll;
    if (fromAll?.drwNo) {
      const full = await fetchDrawByDrwNo(fromAll.drwNo, { retries: 2 });
      if (full) return full;
    }
  } catch {
    /* next */
  }

  // 2) 최신 회차 근처만 역순 소량 조회
  const hint = getLatestDrawHintDrwNo();
  for (let n = hint; n >= hint - 8 && n >= 1; n--) {
    try {
      const draw = await fetchDrawByDrwNo(n, { retries: 1 });
      if (draw) return draw;
    } catch {
      /* try older */
    }
  }

  // 3) Git 스냅샷 (numbers 없을 때)
  return loadLatestDrawSnapshot();
}

/**
 * `all` 응답을 쓸 수 없을 때, 최신 회차부터 역으로 소량만 조회해 추첨일 목록을 만든다.
 */
export async function buildRecentEpisodesFallback(
  maxBack = 100
): Promise<LottoEpisodeSchedule[] | null> {
  const latestNo = await findLatestDrwNoFast(estimateMaxDrwNo());
  if (latestNo === null) return null;
  const acc: LottoEpisodeSchedule[] = [];
  const low = Math.max(1, latestNo - maxBack);
  for (let n = latestNo; n >= low; n--) {
    try {
      const d = await fetchDrawByDrwNo(n, { retries: 1 });
      if (d) acc.push({ drwNo: d.drwNo, drwNoDate: d.drwNoDate });
    } catch {
      /* skip */
    }
  }
  acc.reverse();
  return acc.length ? acc : null;
}
