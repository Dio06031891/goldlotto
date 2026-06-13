import Link from 'next/link';
import { LottoBall } from '@/components/lotto/LottoBall';

type Props = {
  title: string;
  numbers: number[];
  counts: Map<number, number>;
  variant: 'hot' | 'cold';
  windowQuery: string;
};

const variantCopy = {
  hot: {
    footnote: '선택 기간 동안 당첨번호 6개에 가장 많이 포함된 번호입니다.',
    badge: '자주나온',
  },
  cold: {
    footnote: '선택 기간 동안 당첨번호 6개에 가장 적게 포함된 번호입니다.',
    badge: '안나온',
  },
} as const;

export function HotColdList({ title, numbers, counts, variant, windowQuery }: Props) {
  const copy = variantCopy[variant];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            variant === 'hot'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-sky-100 text-sky-800'
          }`}
        >
          {copy.badge}
        </span>
      </div>
      <ol className="mt-4 space-y-3">
        {numbers.map((n, idx) => (
          <li key={n} className="flex items-center gap-3">
            <span className="w-6 text-xs font-bold text-muted">{idx + 1}</span>
            <LottoBall num={n} size="sm" />
            <Link
              href={`/stats/number/${n}${windowQuery}`}
              className="flex-1 text-sm font-semibold text-brand hover:underline"
            >
              {n}번
            </Link>
            <span className="text-sm tabular-nums text-muted">{counts.get(n) ?? 0}회</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted">{copy.footnote}</p>
    </div>
  );
}
