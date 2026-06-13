import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { LottoBall } from '@/components/lotto/LottoBall';

type LottoBallSetProps = {
  numbers: readonly number[];
  bonus?: number;
  size?: 'sm' | 'md' | 'lg';
};

export function LottoBallSet({ numbers, bonus, size = 'md' }: LottoBallSetProps) {
  const sorted = [...numbers].sort((a, b) => a - b);
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {sorted.map((n) => (
        <LottoBall key={n} num={n} size={size} />
      ))}
      {bonus !== undefined && (
        <>
          <span className="px-1 text-lg font-bold text-muted" aria-hidden>
            +
          </span>
          <LottoBall num={bonus} size={size} className="ring-amber-300/80" />
        </>
      )}
    </div>
  );
}

export function LottoBallSetFromDraw({
  draw,
  size,
}: {
  draw: DhLotteryDrawJson;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!draw.numbers) {
    return (
      <p className="text-sm text-muted">당첨번호는 동행복권에서 확인해 주세요.</p>
    );
  }
  return <LottoBallSet numbers={draw.numbers} bonus={draw.bonus} size={size} />;
}
