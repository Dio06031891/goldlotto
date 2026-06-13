import { describe, it, expect } from 'vitest';
import { aggregateFirstPrizeStores } from '@/lib/stores/aggregate-winning-shops';
import { firstPrizeShopsForDraw } from '@/lib/stores/dhlottery-winning-shops';

describe('firstPrizeShopsForDraw', () => {
  it('keeps rank 1 only and dedupes ltShpId per draw', () => {
    const rows = [
      {
        ltShpId: '111',
        wnShpRnk: 1,
        shpNm: 'A',
        shpAddr: '서울',
        region: '서울',
        tm2ShpLctnAddr: '중구',
        atmtPsvYn: 'Q',
        shpLat: 1,
        shpLot: 2,
      },
      {
        ltShpId: '111',
        wnShpRnk: 1,
        shpNm: 'A',
        shpAddr: '서울',
        region: '서울',
        tm2ShpLctnAddr: '중구',
        atmtPsvYn: 'M',
        shpLat: 1,
        shpLot: 2,
      },
      {
        ltShpId: '222',
        wnShpRnk: 2,
        shpNm: 'B',
        shpAddr: '부산',
        region: '부산',
        tm2ShpLctnAddr: null,
        atmtPsvYn: 'Q',
        shpLat: 3,
        shpLot: 4,
      },
      {
        ltShpId: '51100000',
        wnShpRnk: 1,
        shpNm: '온라인',
        shpAddr: '인터넷',
        region: '서울',
        tm2ShpLctnAddr: null,
        atmtPsvYn: 'Q',
        shpLat: 0,
        shpLot: 0,
      },
    ];
    expect(firstPrizeShopsForDraw(rows)).toHaveLength(1);
    expect(firstPrizeShopsForDraw(rows)[0].ltShpId).toBe('111');
  });
});

describe('aggregateFirstPrizeStores', () => {
  it('counts distinct draws per shop', () => {
    const row = (id: string, rank: number) => ({
      ltShpId: id,
      wnShpRnk: rank,
      shpNm: `shop-${id}`,
      shpAddr: `경기 ${id}로 1`,
      region: '경기',
      tm2ShpLctnAddr: '수원시',
      atmtPsvYn: 'Q',
      shpLat: 37,
      shpLot: 127,
    });
    const stores = aggregateFirstPrizeStores([
      { drwNo: 10, rows: [row('1', 1)] },
      { drwNo: 11, rows: [row('1', 1), row('2', 1)] },
      { drwNo: 12, rows: [row('2', 1)] },
    ]);
    const s1 = stores.find((s) => s.ltShpId === '1');
    const s2 = stores.find((s) => s.ltShpId === '2');
    expect(s1?.firstPrizeCount).toBe(2);
    expect(s1?.firstPrizeDraws).toEqual([10, 11]);
    expect(s2?.firstPrizeCount).toBe(2);
  });
});
