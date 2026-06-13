import Link from 'next/link';
import {
  STATS_WINDOW_OPTIONS,
  type StatsWindow,
} from '@/lib/core/stats/window';

type Props = {
  basePath: string;
  current: StatsWindow;
};

export function StatsWindowFilter({ basePath, current }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="분석 구간">
      {STATS_WINDOW_OPTIONS.map((opt) => {
        const q = opt.value === 100 ? '' : `?window=${opt.value}`;
        const href = `${basePath}${q}`;
        const isOn = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={href}
            className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold sm:text-sm ${
              isOn
                ? 'bg-ink text-white'
                : 'bg-slate-100 text-muted hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
