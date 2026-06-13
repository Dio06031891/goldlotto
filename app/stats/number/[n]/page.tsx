import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LottoBall } from '@/components/lotto/LottoBall';
import { StatsDisclaimer } from '@/components/stats/StatsDisclaimer';
import { StatsUnavailable } from '@/components/stats/StatsUnavailable';
import { StatsWindowFilter } from '@/components/stats/StatsWindowFilter';
import { numberDetailStats } from '@/lib/core/stats/calculator';
import { sliceDrawsByWindow, parseStatsWindow } from '@/lib/core/stats/window';
import { getCachedStatsDraws } from '@/lib/lotto/cached-stats-draws';
import { windowQuery } from '@/lib/stats/load-stats-page';

type PageProps = {
  params: { n: string };
  searchParams: { window?: string };
};

export function generateStaticParams() {
  return Array.from({ length: 45 }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const num = parseInt(params.n, 10);
  if (num < 1 || num > 45) return { title: '번호 통계' };
  return {
    title: `로또 ${num}번 통계 | 출현·미출현`,
    description: `로또 6/45 ${num}번의 최근 출현 횟수, 보너스 출현, 마지막 당첨 회차를 확인합니다.`,
    alternates: { canonical: `/stats/number/${num}` },
  };
}

export default async function StatsNumberPage({ params, searchParams }: PageProps) {
  const num = parseInt(params.n, 10);
  if (!Number.isFinite(num) || num < 1 || num > 45) notFound();

  const payload = await getCachedStatsDraws();
  if (!payload) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <StatsUnavailable />
      </main>
    );
  }

  const window = parseStatsWindow(searchParams.window);
  const draws = sliceDrawsByWindow(payload.draws, window);
  const detail = numberDetailStats(draws, num);
  const wq = windowQuery(window);

  const recentHits = draws
    .filter((d) => d.numbers?.some((x) => x === num) || d.bonus === num)
    .slice(-8)
    .reverse();

  const expectedPerNumber =
    draws.length > 0 ? ((draws.length * 6) / 45).toFixed(1) : '—';

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <Link href={`/stats${wq}`} className="text-sm font-semibold text-brand hover:underline">
        ← 통계 홈
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <LottoBall num={num} size="lg" />
        <div>
          <h1 className="text-3xl font-extrabold text-ink">{num}번 통계</h1>
          <p className="mt-1 text-sm text-muted">분석 {draws.length}회차</p>
        </div>
      </div>

      <div className="mt-6">
        <StatsDisclaimer />
      </div>
      <div className="mt-4">
        <StatsWindowFilter basePath={`/stats/number/${num}`} current={window} />
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-medium text-muted">당첨 6개 출현</dt>
          <dd className="mt-1 text-2xl font-extrabold text-ink">{detail.mainCount}회</dd>
          <dd className="text-xs text-muted">기대치 약 {expectedPerNumber}회/45</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-medium text-muted">보너스 출현</dt>
          <dd className="mt-1 text-2xl font-extrabold text-ink">{detail.bonusCount}회</dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-medium text-muted">마지막 출현 회차</dt>
          <dd className="mt-1 text-xl font-bold text-ink">
            {detail.lastSeenDrwNo ? (
              <Link href={`/draw/${detail.lastSeenDrwNo}`} className="text-brand hover:underline">
                제{detail.lastSeenDrwNo}회
              </Link>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <dt className="text-xs font-medium text-muted">평균 출현 간격 (회차)</dt>
          <dd className="mt-1 text-xl font-bold text-ink">
            {detail.avgGap !== null ? detail.avgGap : '—'}
          </dd>
        </div>
      </dl>

      {recentHits.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold text-ink">최근 포함 회차</h2>
          <ul className="mt-3 space-y-2">
            {recentHits.map((d) => (
              <li key={d.drwNo}>
                <Link
                  href={`/draw/${d.drwNo}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm hover:border-gold"
                >
                  <span className="font-semibold">제{d.drwNo}회</span>
                  <span className="text-muted">
                    {d.numbers?.some((x) => x === num) ? '당첨번호' : '보너스'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {num > 1 && (
          <Link
            href={`/stats/number/${num - 1}${wq}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-gold"
          >
            ← {num - 1}번
          </Link>
        )}
        {num < 45 && (
          <Link
            href={`/stats/number/${num + 1}${wq}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-gold"
          >
            {num + 1}번 →
          </Link>
        )}
      </div>
    </main>
  );
}
