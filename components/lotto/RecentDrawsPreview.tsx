import Link from 'next/link';
import { LottoBallSetFromDraw } from '@/components/lotto/LottoBallSet';
import { formatKRW } from '@/lib/core/format/currency';
import { getCachedRecentDraws } from '@/lib/lotto/cached-recent-draws';
import { formatYmdKorean } from '@/lib/lotto/draw-format';

export async function RecentDrawsPreview() {
  const draws = await getCachedRecentDraws(5);
  if (draws.length === 0) return null;

  const latestNo = draws[0]?.drwNo;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-14" aria-label="최근 당첨번호">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">최근 당첨번호</h2>
          <p className="mt-1 text-sm text-muted">최근 {draws.length}회차 요약</p>
        </div>
        {latestNo !== undefined && (
          <Link
            href={`/draw/${latestNo}`}
            className="text-sm font-bold text-brand hover:underline"
          >
            최신 회차 상세 →
          </Link>
        )}
      </div>
      <ul className="mt-6 space-y-3">
        {draws.map((draw) => (
          <li key={draw.drwNo}>
            <Link
              href={`/draw/${draw.drwNo}`}
              className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-gold/50 hover:shadow-md sm:px-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-ink">
                  제{draw.drwNo}회
                  <span className="ml-2 text-sm font-medium text-muted">
                    {formatYmdKorean(draw.drwNoDate)}
                  </span>
                </p>
                <p className="text-xs font-semibold text-muted">
                  1등 {formatKRW(draw.firstWinamnt)}
                </p>
              </div>
              <div className="mt-3">
                <LottoBallSetFromDraw draw={draw} size="sm" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
