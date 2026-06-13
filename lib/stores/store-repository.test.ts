import { describe, it, expect } from 'vitest';
import { getTopLuckStores, searchStores } from '@/lib/stores/store-repository';

describe('store-repository', () => {
  it('returns top luck stores sorted by count', () => {
    const top = getTopLuckStores(3);
    expect(top.length).toBe(3);
    expect(top[0].firstPrizeCount).toBeGreaterThanOrEqual(top[1].firstPrizeCount);
  });

  it('searches by query', () => {
    const top = getTopLuckStores(1);
    expect(top.length).toBe(1);
    const found = searchStores({ q: top[0].name.slice(0, 2), limit: 20 });
    expect(found.length).toBeGreaterThan(0);
  });

  it('filters by radius from seoul center', () => {
    const near = searchStores({ lat: 37.5665, lng: 126.978, radiusKm: 15, limit: 20 });
    expect(near.length).toBeGreaterThan(0);
    expect(near[0].distanceKm).toBeDefined();
  });
});
