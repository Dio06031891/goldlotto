import { describe, it, expect } from 'vitest';
import { distanceKm } from '@/lib/core/geo/haversine';

describe('distanceKm', () => {
  it('returns ~0 for same point', () => {
    expect(distanceKm(37.5, 127.0, 37.5, 127.0)).toBeLessThan(0.01);
  });

  it('returns positive distance for different points', () => {
    const d = distanceKm(37.5665, 126.978, 35.1796, 129.0756);
    expect(d).toBeGreaterThan(300);
    expect(d).toBeLessThan(400);
  });
});
