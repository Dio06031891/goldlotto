import { distanceKm } from '@/lib/core/geo/haversine';
import {
  findSidoBySlug,
  matchSigunguSlug,
  parseSigunguSlug,
  type SidoInfo,
} from '@/lib/stores/korea-regions';
import {
  loadLuckStoresBySido,
  loadLuckStoresFromDisk,
  loadLuckStoresMetaFromDisk,
  loadTopLuckStores,
} from '@/lib/stores/luck-stores-loader';
import type { LottoStore } from '@/lib/types/store';

export function getLuckStoresMeta() {
  return loadLuckStoresMetaFromDisk();
}

export function isSyncedLuckStores(): boolean {
  return loadLuckStoresMetaFromDisk() !== null;
}

export type StoreSearchParams = {
  q?: string;
  sidoSlug?: string;
  sigunguSlug?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  luckOnly?: boolean;
  limit?: number;
};

export type StoreWithDistance = LottoStore & { distanceKm?: number };

function normalize(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase();
}

function allStores(): LottoStore[] {
  return loadLuckStoresFromDisk();
}

export function getAllStores(): LottoStore[] {
  return allStores();
}

export function getTopLuckStores(limit = 50): LottoStore[] {
  return loadTopLuckStores(limit);
}

export function getStoresBySido(sido: SidoInfo): LottoStore[] {
  return loadLuckStoresBySido(sido);
}

export function getStoresBySigungu(sidoSlug: string, sigunguKey: string): LottoStore[] {
  const sido = findSidoBySlug(sidoSlug);
  if (!sido) return [];
  return getStoresBySido(sido).filter((s) => matchSigunguSlug(s.sigungu, sigunguKey));
}

export function searchStores(params: StoreSearchParams): StoreWithDistance[] {
  const {
    q,
    sidoSlug,
    sigunguSlug: citySlug,
    lat,
    lng,
    radiusKm = 5,
    luckOnly = false,
    limit = 100,
  } = params;

  let list = allStores();
  if (luckOnly) {
    list = list.filter((s) => s.firstPrizeCount > 0);
  }

  if (sidoSlug) {
    const sido = findSidoBySlug(sidoSlug);
    if (sido) list = getStoresBySido(sido);
  }

  if (citySlug) {
    const parsed = parseSigunguSlug(citySlug);
    if (parsed) {
      list = getStoresBySigungu(parsed.sidoSlug, parsed.sigunguKey);
    }
  }

  if (q?.trim()) {
    const nq = normalize(q.trim());
    list = list.filter(
      (s) =>
        normalize(s.name).includes(nq) ||
        normalize(s.roadAddress).includes(nq) ||
        normalize(s.sigungu).includes(nq)
    );
  }

  let withDist: StoreWithDistance[] = list.map((s) => ({ ...s }));

  if (lat !== undefined && lng !== undefined && Number.isFinite(lat) && Number.isFinite(lng)) {
    withDist = withDist
      .map((s) => ({
        ...s,
        distanceKm: distanceKm(lat, lng, s.lat, s.lng),
      }))
      .filter((s) => s.distanceKm! <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  } else {
    withDist.sort(
      (a, b) => b.firstPrizeCount - a.firstPrizeCount || a.name.localeCompare(b.name, 'ko')
    );
  }

  return withDist.slice(0, limit);
}

export function listSigunguInSido(sido: SidoInfo): { slug: string; name: string; count: number }[] {
  const stores = getStoresBySido(sido);
  const map = new Map<string, number>();
  for (const s of stores) {
    map.set(s.sigungu, (map.get(s.sigungu) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({
      slug: `${sido.slug}-${name.replace(/\s+/g, '').replace(/시|군|구/g, '')}`,
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'));
}

export function getStoreById(id: string): LottoStore | undefined {
  return allStores().find((s) => s.id === id);
}
