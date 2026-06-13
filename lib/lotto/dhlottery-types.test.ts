import { describe, expect, it } from 'vitest';
import {
  isSuccessDraw,
  parseDhLotteryDraw,
  parsePstLt645AllListLatest,
  parsePstLt645AllListSchedule,
  parsePstLt645Response,
  prizeForRank,
} from './dhlottery-types';

const sample = {
  returnValue: 'success',
  drwNo: 1199,
  drwNoDate: '2025-07-12',
  firstWinamnt: 1_800_000_000,
  secondWinamnt: 50_000_000,
  thirdWinamnt: 1_500_000,
  fourthWinamnt: 50_000,
  fifthWinamnt: 5_000,
};

describe('parseDhLotteryDraw', () => {
  it('accepts valid payload', () => {
    expect(parseDhLotteryDraw(sample)).toEqual(sample);
  });

  it('coerces string amounts', () => {
    expect(
      parseDhLotteryDraw({
        ...sample,
        fifthWinamnt: '5000',
        firstWinamnt: '1800000000',
      })
    ).toMatchObject({ fifthWinamnt: 5000, firstWinamnt: 1_800_000_000 });
  });

  it('rejects fail', () => {
    expect(parseDhLotteryDraw({ ...sample, returnValue: 'fail' })).toBeNull();
  });
});

describe('isSuccessDraw', () => {
  it('mirrors parse', () => {
    expect(isSuccessDraw(sample)).toBe(true);
    expect(isSuccessDraw({})).toBe(false);
  });
});

describe('parsePstLt645Response', () => {
  const pst1199 = {
    resultCode: null,
    resultMessage: null,
    data: {
      list: [
        {
          ltEpsd: 1199,
          ltRflYmd: '20251122',
          tm1WnNo: 16,
          tm2WnNo: 24,
          tm3WnNo: 25,
          tm4WnNo: 30,
          tm5WnNo: 31,
          tm6WnNo: 32,
          bnsWnNo: 7,
          rnk1WnNope: 17,
          rnk1WnAmt: 1_695_609_839,
          rnk2WnAmt: 64_056_372,
          rnk3WnAmt: 1_371_070,
          rnk4WnAmt: 50_000,
          rnk5WnAmt: 5_000,
        },
      ],
    },
  };

  it('maps lt645 row to DhLotteryDrawJson', () => {
    expect(parsePstLt645Response(pst1199, 1199)).toEqual({
      returnValue: 'success',
      drwNo: 1199,
      drwNoDate: '2025-11-22',
      numbers: [16, 24, 25, 30, 31, 32],
      bonus: 7,
      firstWinnerCount: 17,
      firstWinamnt: 1_695_609_839,
      secondWinamnt: 64_056_372,
      thirdWinamnt: 1_371_070,
      fourthWinamnt: 50_000,
      fifthWinamnt: 5_000,
    });
  });

  it('rejects episode mismatch', () => {
    expect(parsePstLt645Response(pst1199, 1200)).toBeNull();
  });

  const pstTwo = {
    data: {
      list: [
        pst1199.data.list[0],
        {
          ltEpsd: 1200,
          ltRflYmd: '20251129',
          rnk1WnAmt: 1_000,
          rnk2WnAmt: 2_000,
          rnk3WnAmt: 3_000,
          rnk4WnAmt: 50_000,
          rnk5WnAmt: 5_000,
        },
      ],
    },
  };

  it('parsePstLt645AllListLatest picks highest episode', () => {
    expect(parsePstLt645AllListLatest(pstTwo)).toMatchObject({
      drwNo: 1200,
      drwNoDate: '2025-11-29',
    });
    const unsorted = {
      data: {
        list: [pstTwo.data.list[1], pstTwo.data.list[0]],
      },
    };
    expect(parsePstLt645AllListLatest(unsorted)).toMatchObject({ drwNo: 1200 });
  });

  it('parsePstLt645AllListSchedule maps episode and date only', () => {
    expect(parsePstLt645AllListSchedule(pstTwo)).toEqual([
      { drwNo: 1199, drwNoDate: '2025-11-22' },
      { drwNo: 1200, drwNoDate: '2025-11-29' },
    ]);
  });
});

describe('prizeForRank', () => {
  it('maps ranks', () => {
    const d = parseDhLotteryDraw(sample)!;
    expect(prizeForRank(d, 1)).toBe(1_800_000_000);
    expect(prizeForRank(d, 5)).toBe(5_000);
  });
});
