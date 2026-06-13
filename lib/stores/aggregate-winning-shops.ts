import {
  atmtPsvToDealType,
  type DhWinningShopRow,
  firstPrizeShopsForDraw,
} from '@/lib/stores/dhlottery-winning-shops';
import type { LottoStore } from '@/lib/types/store';

type MutableStore = {
  ltShpId: string;
  name: string;
  roadAddress: string;
  sido: string;
  sigungu: string;
  lat: number;
  lng: number;
  phone?: string;
  draws: number[];
  dealType?: LottoStore['dealType'];
};

function normalizeSido(region: string): string {
  return region.trim();
}

function normalizeSigungu(tm2: string | null, roadAddress: string): string {
  if (tm2?.trim()) return tm2.trim();
  const m = roadAddress.match(
    /(?:특별자치도|광역시|특별시|도)\s+([가-힣]+(?:시|군|구))/
  );
  return m?.[1] ?? '기타';
}

function rowToPartial(row: DhWinningShopRow): Omit<MutableStore, 'draws'> | null {
  const roadAddress = row.shpAddr?.trim() ?? '';
  const name = row.shpNm?.trim() ?? '';
  if (!roadAddress || !name) return null;
  return {
    ltShpId: row.ltShpId,
    name,
    roadAddress,
    sido: normalizeSido(row.region ?? ''),
    sigungu: normalizeSigungu(row.tm2ShpLctnAddr, roadAddress),
    lat: row.shpLat,
    lng: row.shpLot,
    phone: row.shpTelno?.trim() || undefined,
    dealType: atmtPsvToDealType(row.atmtPsvYn),
  };
}

export function aggregateFirstPrizeStores(
  draws: { drwNo: number; rows: DhWinningShopRow[] }[]
): LottoStore[] {
  const map = new Map<string, MutableStore>();

  for (const { drwNo, rows } of draws) {
    for (const row of firstPrizeShopsForDraw(rows)) {
      const key = row.ltShpId;
      let entry = map.get(key);
      if (!entry) {
        const partial = rowToPartial(row);
        if (!partial) continue;
        entry = { ...partial, draws: [] };
        map.set(key, entry);
      }
      if (!entry.draws.includes(drwNo)) {
        entry.draws.push(drwNo);
      }
      entry.dealType = atmtPsvToDealType(row.atmtPsvYn) ?? entry.dealType;
    }
  }

  return Array.from(map.values())
    .map((s) => ({
      id: `lt-${s.ltShpId}`,
      name: s.name,
      roadAddress: s.roadAddress,
      sido: s.sido,
      sigungu: s.sigungu,
      lat: s.lat,
      lng: s.lng,
      phone: s.phone,
      firstPrizeCount: s.draws.length,
      firstPrizeDraws: [...s.draws].sort((a, b) => a - b),
      dealType: s.dealType,
      ltShpId: s.ltShpId,
    }))
    .sort(
      (a, b) =>
        b.firstPrizeCount - a.firstPrizeCount ||
        a.name.localeCompare(b.name, 'ko')
    );
}
