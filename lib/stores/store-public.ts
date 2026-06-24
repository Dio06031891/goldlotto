import type { LottoStore } from '@/lib/types/store';

/** API·클라이언트로 내려줄 때 회차 배열은 제외 (용량·개인정보 무관 단순 최적화) */
export type LottoStorePublic = Omit<LottoStore, 'firstPrizeDraws'> & {
  firstPrizeDraws?: number[];
};

export function toPublicStore(store: LottoStore, opts?: { includeDraws?: boolean }): LottoStorePublic {
  if (opts?.includeDraws) return store;
  const { firstPrizeDraws, recentDraws, ...rest } = store;
  const draws = recentDraws ?? firstPrizeDraws?.slice(-5);
  return draws?.length ? { ...rest, recentDraws: draws } : rest;
}

export function toPublicStores(
  stores: LottoStore[],
  opts?: { includeDraws?: boolean }
): LottoStorePublic[] {
  return stores.map((s) => toPublicStore(s, opts));
}
