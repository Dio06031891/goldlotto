import { describe, expect, it } from 'vitest';
import { afterTax, calcTax } from './calculator';

describe('calcTax', () => {
  it('200만원 이하는 비과세', () => {
    expect(calcTax(50_000)).toBe(0);
    expect(calcTax(1_000_000)).toBe(0);
    expect(calcTax(2_000_000)).toBe(0);
    expect(calcTax(2_001_000)).toBe(0);
  });

  it('22% 구간 정확 계산', () => {
    expect(calcTax(5_000_000)).toBe(1_099_780);
    expect(calcTax(100_000_000)).toBe(21_999_780);
  });

  it('3억원 경계 처리', () => {
    expect(calcTax(300_000_000)).toBe(65_999_780);
  });

  it('3억 초과 누진 계산', () => {
    expect(calcTax(1_000_000_000)).toBe(296_999_670);
  });

  it('12억 정확 계산', () => {
    expect(calcTax(1_200_000_000)).toBe(362_999_670);
  });

  it('18.5755억 정확 계산', () => {
    expect(calcTax(1_857_550_000)).toBe(579_991_170);
  });

  it('30억 당첨', () => {
    expect(calcTax(3_000_000_000)).toBe(956_999_670);
  });

  it('음수 입력 거부', () => {
    expect(() => calcTax(-1)).toThrow();
  });

  it('소수 입력 거부', () => {
    expect(() => calcTax(1.5)).toThrow();
  });
});

describe('afterTax', () => {
  it('실수령액 = 당첨금 - 세금', () => {
    expect(afterTax(5_000_000)).toBe(3_900_220);
    expect(afterTax(100_000_000)).toBe(78_000_220);
    expect(afterTax(1_000_000_000)).toBe(703_000_330);
    expect(afterTax(1_857_550_000)).toBe(1_277_558_830);
  });
});
