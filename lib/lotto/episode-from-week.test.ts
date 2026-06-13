import { describe, expect, it } from 'vitest';
import { findEpisodeInCalendarWeek } from './episode-from-week';

describe('findEpisodeInCalendarWeek', () => {
  const episodes = [
    { drwNo: 1198, drwNoDate: '2025-11-15' },
    { drwNo: 1199, drwNoDate: '2025-11-22' },
  ];

  it('returns exact date match', () => {
    expect(findEpisodeInCalendarWeek(episodes, '2025-11-15')).toEqual(episodes[0]);
  });

  it('returns episode in same calendar week as pick', () => {
    expect(findEpisodeInCalendarWeek(episodes, '2025-11-20')).toEqual(episodes[1]);
  });

  it('returns null when week has no draw', () => {
    expect(findEpisodeInCalendarWeek(episodes, '2025-11-05')).toBeNull();
  });
});
