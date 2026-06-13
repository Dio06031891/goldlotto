/**
 * 동행복권 1·2등 당첨 판매점 API (gameResult → selectLtWnShp)
 * @see https://www.dhlottery.co.kr/gameResult.do?method=byWin
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const WIN_SHOP_HEADERS: Record<string, string> = {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'X-Requested-With': 'XMLHttpRequest',
  Referer: 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
  'User-Agent': UA,
};

/** 동행복권 인터넷 복권판매사업자 (오프라인 명당 목록에서 제외) */
export const DHLOTTERY_ONLINE_SHOP_ID = '51100000';

export type DhWinningShopRow = {
  shpNm: string;
  shpTelno: string | null;
  region: string;
  tm2ShpLctnAddr: string | null;
  shpAddr: string;
  atmtPsvYn: string;
  atmtPsvYnTxt: string;
  ltShpId: string;
  wnShpRnk: number;
  shpLat: number;
  shpLot: number;
};

export type DhWinningShopResponse = {
  data?: {
    total?: number;
    list?: DhWinningShopRow[];
  };
};

export function winningShopUrl(drwNo: number): string {
  return `https://www.dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do?srchLtEpsd=${encodeURIComponent(
    String(drwNo)
  )}`;
}

export function parseWinningShopResponse(raw: unknown): DhWinningShopRow[] {
  const body = raw as DhWinningShopResponse;
  const list = body?.data?.list;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (row): row is DhWinningShopRow =>
      typeof row === 'object' &&
      row !== null &&
      typeof (row as DhWinningShopRow).ltShpId === 'string' &&
      typeof (row as DhWinningShopRow).wnShpRnk === 'number'
  );
}

export function atmtPsvToDealType(code: string): 'auto' | 'manual' | 'semi' | undefined {
  if (code === 'Q') return 'auto';
  if (code === 'M') return 'manual';
  if (code === 'B') return 'semi';
  return undefined;
}

export async function fetchWinningShopsForDraw(
  drwNo: number,
  opts?: { retries?: number }
): Promise<DhWinningShopRow[]> {
  const maxAttempts = opts?.retries ?? 3;
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(winningShopUrl(drwNo), {
        cache: 'no-store',
        signal: AbortSignal.timeout(45_000),
        headers: WIN_SHOP_HEADERS,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for draw ${drwNo}`);
      }
      const json = (await res.json()) as unknown;
      return parseWinningShopResponse(json);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** 해당 회차 1등(wnShpRnk=1) 오프라인 판매점 — 동일 ltShpId·회차는 1회만 */
export function firstPrizeShopsForDraw(rows: DhWinningShopRow[]): DhWinningShopRow[] {
  const seen = new Set<string>();
  const out: DhWinningShopRow[] = [];
  for (const row of rows) {
    if (row.wnShpRnk !== 1) continue;
    if (row.ltShpId === DHLOTTERY_ONLINE_SHOP_ID) continue;
    const key = row.ltShpId;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}
