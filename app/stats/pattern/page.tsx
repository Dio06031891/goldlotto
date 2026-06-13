import Link from 'next/link';
import { StatsBarChart } from '@/components/stats/StatsBarChart';
import { StatsDisclaimer } from '@/components/stats/StatsDisclaimer';
import { StatsSubNav } from '@/components/stats/StatsSubNav';
import { StatsUnavailable } from '@/components/stats/StatsUnavailable';
import { StatsWindowFilter } from '@/components/stats/StatsWindowFilter';
import { loadStatsPageData, windowQuery } from '@/lib/stats/load-stats-page';

type PageProps = {
  searchParams: { window?: string };
};

export const metadata = {
  title: '패턴 분석 | 로또 통계',
  alternates: { canonical: '/stats/pattern' },
};

export default async function StatsPatternPage({ searchParams }: PageProps) {
  const data = await loadStatsPageData(searchParams.window);
  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <StatsUnavailable />
      </main>
    );
  }

  const { bundle, window } = data;
  const wq = windowQuery(window);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold text-ink">패턴 분석</h1>
      <div className="mt-6">
        <StatsDisclaimer />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StatsSubNav windowQuery={wq} active="/stats/pattern" />
        <StatsWindowFilter basePath="/stats/pattern" current={window} />
      </div>

      <section className="mt-8 space-y-8">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-ink">당첨번호 합계 분포</h2>
          <div className="mt-4">
            <StatsBarChart
              data={bundle.sums.map((s) => ({ label: s.bucket, count: s.count }))}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-ink">연속 번호 출현</h2>
          <div className="mt-4">
            <StatsBarChart
              data={bundle.consecutive.map((c) => ({ label: c.label, count: c.count }))}
              color="#059669"
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-ink">끝자리 분포</h2>
          <div className="mt-4">
            <StatsBarChart
              data={bundle.endings.map((e) => ({ label: e.digit, count: e.count }))}
              color="#7c3aed"
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-ink">자주 같이 나온 번호 쌍</h2>
          <ol className="mt-4 space-y-2">
            {bundle.pairs.map((p, i) => (
              <li
                key={p.pair}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-ink">
                  {i + 1}. {p.pair.replace('-', ' · ')}번
                </span>
                <span className="text-muted">{p.count}회</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <Link href={`/stats${wq}`} className="mt-8 inline-block text-sm font-bold text-brand hover:underline">
        ← 통계 홈
      </Link>
    </main>
  );
}
