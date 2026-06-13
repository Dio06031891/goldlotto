import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { prizeForRank, type LottoRank } from '@/lib/lotto/dhlottery-types';
import { formatKRW } from '@/lib/core/format/currency';

const RANKS: LottoRank[] = [1, 2, 3, 4, 5];

export function DrawPrizeTable({ draw }: { draw: DhLotteryDrawJson }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[280px] text-left text-sm">
        <caption className="sr-only">등수별 당첨금</caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 font-semibold text-ink">등수</th>
            <th className="px-4 py-3 font-semibold text-ink">1인당 당첨금</th>
          </tr>
        </thead>
        <tbody>
          {RANKS.map((rank) => (
            <tr key={rank} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-ink">{rank}등</td>
              <td className="px-4 py-3 tabular-nums text-ink">
                {formatKRW(prizeForRank(draw, rank))}
                {rank === 1 && draw.firstWinnerCount !== undefined && (
                  <span className="mt-0.5 block text-xs text-muted">
                    당첨 {draw.firstWinnerCount.toLocaleString('ko-KR')}명
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
