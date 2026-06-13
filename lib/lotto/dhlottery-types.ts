/** 동행복권 getLottoNumber JSON (필요 필드만) */
export interface DhLotteryDrawJson {
  returnValue: string;
  drwNo: number;
  drwNoDate: string;
  /** 당첨번호 6개 (lt645 API에 있을 때) */
  numbers?: [number, number, number, number, number, number];
  bonus?: number;
  firstWinnerCount?: number;
  firstWinamnt: number;
  secondWinamnt: number;
  thirdWinamnt: number;
  fourthWinamnt: number;
  fifthWinamnt: number;
}

export type LottoRank = 1 | 2 | 3 | 4 | 5;

/** 전체 목록 API에서 회차·추첨일만 추출 (달력 매칭용) */
export interface LottoEpisodeSchedule {
  drwNo: number;
  drwNoDate: string;
}

function readInt(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === 'string' && /^\d+$/.test(v.trim())) {
    return parseInt(v.trim(), 10);
  }
  return null;
}

/** API 원본을 정수 필드로 정규화해 검증 */
export function parseDhLotteryDraw(raw: unknown): DhLotteryDrawJson | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.returnValue !== 'success') return null;

  const drwNo = readInt(o.drwNo);
  const drwNoDate = typeof o.drwNoDate === 'string' ? o.drwNoDate : null;
  const firstWinamnt = readInt(o.firstWinamnt);
  const secondWinamnt = readInt(o.secondWinamnt);
  const thirdWinamnt = readInt(o.thirdWinamnt);
  const fourthWinamnt = readInt(o.fourthWinamnt);
  const fifthWinamnt = readInt(o.fifthWinamnt);
  const numbers = readNumbersArray(o.numbers);
  const bonus = readInt(o.bonus);
  const firstWinnerCount = readInt(o.firstWinnerCount);

  if (
    drwNo === null ||
    !drwNoDate ||
    firstWinamnt === null ||
    secondWinamnt === null ||
    thirdWinamnt === null ||
    fourthWinamnt === null ||
    fifthWinamnt === null
  ) {
    return null;
  }

  return {
    returnValue: 'success',
    drwNo,
    drwNoDate,
    ...(numbers ? { numbers } : {}),
    ...(bonus !== null && bonus >= 1 && bonus <= 45 ? { bonus } : {}),
    ...(firstWinnerCount !== null ? { firstWinnerCount } : {}),
    firstWinamnt,
    secondWinamnt,
    thirdWinamnt,
    fourthWinamnt,
    fifthWinamnt,
  };
}

function readNumbersArray(
  v: unknown
): [number, number, number, number, number, number] | undefined {
  if (!Array.isArray(v) || v.length !== 6) return undefined;
  const nums = v.map((x) => readInt(x));
  if (nums.some((n) => n === null)) return undefined;
  if (nums.some((n) => n! < 1 || n! > 45)) return undefined;
  const sorted = [...nums] as number[];
  sorted.sort((a, b) => a - b);
  return sorted as [number, number, number, number, number, number];
}

export function prizeForRank(data: DhLotteryDrawJson, rank: LottoRank): number {
  switch (rank) {
    case 1:
      return data.firstWinamnt;
    case 2:
      return data.secondWinamnt;
    case 3:
      return data.thirdWinamnt;
    case 4:
      return data.fourthWinamnt;
    case 5:
      return data.fifthWinamnt;
    default:
      return 0;
  }
}

/** @deprecated parseDhLotteryDraw 사용 */
export function isSuccessDraw(raw: unknown): raw is DhLotteryDrawJson {
  return parseDhLotteryDraw(raw) !== null;
}

/**
 * lt645/selectPstLt645Info.do JSON → 계산기용 정규 형식
 * (동행복권 common.do getLottoNumber 은 HTML만 반환되는 경우가 많아 이 경로 사용)
 */
export function parsePstLt645Response(
  raw: unknown,
  expectedEpsd: number
): DhLotteryDrawJson | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const list = (data as { list?: unknown }).list;
  if (!Array.isArray(list) || list.length === 0) return null;

  const row = list.find((item) => {
    if (!item || typeof item !== 'object') return false;
    return readInt((item as Record<string, unknown>).ltEpsd) === expectedEpsd;
  });
  const chosen = row ?? list[0];
  if (!chosen || typeof chosen !== 'object') return null;

  const mapped = mapLt645ListRowToDraw(chosen as Record<string, unknown>);
  if (!mapped || mapped.drwNo !== expectedEpsd) return null;
  return mapped;
}

/** `srchLtEpsd=all` 응답에서 회차·추첨일 목록만 추출 */
export function parsePstLt645AllListSchedule(
  raw: unknown
): LottoEpisodeSchedule[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const list = (data as { list?: unknown }).list;
  if (!Array.isArray(list) || list.length === 0) return null;

  const out: LottoEpisodeSchedule[] = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const ltEpsd = readInt(o.ltEpsd);
    const ymd = typeof o.ltRflYmd === 'string' ? o.ltRflYmd.trim() : '';
    const drwNoDate =
      ymd.length === 8 && /^\d{8}$/.test(ymd)
        ? `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`
        : null;
    if (ltEpsd !== null && drwNoDate) {
      out.push({ drwNo: ltEpsd, drwNoDate });
    }
  }
  return out.length ? out : null;
}

/** `srchLtEpsd=all` 응답 목록에서 회차 번호가 가장 큰 행(최신) */
export function parsePstLt645AllListLatest(raw: unknown): DhLotteryDrawJson | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const list = (data as { list?: unknown }).list;
  if (!Array.isArray(list) || list.length === 0) return null;

  let bestRow: Record<string, unknown> | null = null;
  let bestEpsd = 0;
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const ltEpsd = readInt(o.ltEpsd);
    if (ltEpsd !== null && ltEpsd > bestEpsd) {
      bestEpsd = ltEpsd;
      bestRow = o;
    }
  }
  if (!bestRow) return null;
  return mapLt645ListRowToDraw(bestRow);
}

/** `srchLtEpsd=all` 목록에서 당첨번호가 있는 회차만 (최근 N회 제한 가능) */
export function parsePstLt645AllListDraws(
  raw: unknown,
  maxRecent = 0
): DhLotteryDrawJson[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const list = (data as { list?: unknown }).list;
  if (!Array.isArray(list) || list.length === 0) return null;

  const draws: DhLotteryDrawJson[] = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const mapped = mapLt645ListRowToDraw(item as Record<string, unknown>);
    if (mapped?.numbers) draws.push(mapped);
  }
  if (!draws.length) return null;
  if (maxRecent > 0 && draws.length > maxRecent) {
    return draws.slice(-maxRecent);
  }
  return draws;
}

function mapLt645ListRowToDraw(o: Record<string, unknown>): DhLotteryDrawJson | null {
  const ltEpsd = readInt(o.ltEpsd);
  if (ltEpsd === null) return null;

  const ymd = typeof o.ltRflYmd === 'string' ? o.ltRflYmd.trim() : '';
  const drwNoDate =
    ymd.length === 8 && /^\d{8}$/.test(ymd)
      ? `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`
      : null;

  const firstWinamnt = readInt(o.rnk1WnAmt);
  const secondWinamnt = readInt(o.rnk2WnAmt);
  const thirdWinamnt = readInt(o.rnk3WnAmt);
  const fourthWinamnt = readInt(o.rnk4WnAmt);
  const fifthWinamnt = readInt(o.rnk5WnAmt);

  if (
    !drwNoDate ||
    firstWinamnt === null ||
    secondWinamnt === null ||
    thirdWinamnt === null ||
    fourthWinamnt === null ||
    fifthWinamnt === null
  ) {
    return null;
  }

  const win = readWinNumbers(o);

  return {
    returnValue: 'success',
    drwNo: ltEpsd,
    drwNoDate,
    ...(win ? { numbers: win.numbers, bonus: win.bonus } : {}),
    ...(readInt(o.rnk1WnNope) !== null
      ? { firstWinnerCount: readInt(o.rnk1WnNope)! }
      : {}),
    firstWinamnt,
    secondWinamnt,
    thirdWinamnt,
    fourthWinamnt,
    fifthWinamnt,
  };
}

function readWinNumbers(
  o: Record<string, unknown>
): { numbers: [number, number, number, number, number, number]; bonus: number } | null {
  const nums = ([1, 2, 3, 4, 5, 6] as const).map((i) => readInt(o[`tm${i}WnNo`]));
  const bonus = readInt(o.bnsWnNo);
  if (nums.some((n) => n === null) || bonus === null) return null;
  if (nums.some((n) => n! < 1 || n! > 45) || bonus < 1 || bonus > 45) return null;
  const sorted = [...nums] as number[];
  sorted.sort((a, b) => a - b);
  return {
    numbers: sorted as [number, number, number, number, number, number],
    bonus,
  };
}
