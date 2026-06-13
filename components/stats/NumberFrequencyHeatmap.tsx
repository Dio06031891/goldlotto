import Link from 'next/link';
import { lottoBallColor } from '@/lib/lotto/lotto-ball-colors';

type Row = { n: number; count: number };

type Props = {
  table: Row[];
  maxCount: number;
  windowQuery: string;
};

export function NumberFrequencyHeatmap({ table, maxCount, windowQuery }: Props) {
  return (
    <div className="grid grid-cols-9 gap-1.5 sm:grid-cols-9 sm:gap-2">
      {table.map(({ n, count }) => {
        const intensity = maxCount > 0 ? count / maxCount : 0;
        const alpha = 0.15 + intensity * 0.85;
        return (
          <Link
            key={n}
            href={`/stats/number/${n}${windowQuery}`}
            className="flex aspect-square flex-col items-center justify-center rounded-lg text-center shadow-sm ring-1 ring-slate-200/80 transition hover:ring-brand"
            style={{
              backgroundColor: `color-mix(in srgb, ${lottoBallColor(n)} ${Math.round(alpha * 100)}%, white)`,
            }}
            title={`${n}번 · ${count}회`}
          >
            <span className="text-xs font-bold text-ink sm:text-sm">{n}</span>
            <span className="text-[10px] font-semibold text-muted sm:text-xs">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
