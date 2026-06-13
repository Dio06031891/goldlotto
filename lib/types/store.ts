export interface LottoStore {
  id: string;
  /** 동행복권 판매점 ID (동기화 데이터) */
  ltShpId?: string;
  name: string;
  roadAddress: string;
  jibunAddress?: string;
  sido: string;
  sigungu: string;
  lat: number;
  lng: number;
  phone?: string;
  firstPrizeCount: number;
  /** 전체 회차 (동기화 원본). slim 파일은 recentDraws만 둘 수 있음 */
  firstPrizeDraws?: number[];
  /** slim 데이터: 최근 당첨 회차 최대 5개 */
  recentDraws?: number[];
  /** 자동·수동·반자동 (당첨 방식 참고) */
  dealType?: 'auto' | 'manual' | 'semi';
}

export function isLuckyStore(store: LottoStore): boolean {
  return store.firstPrizeCount > 0;
}
