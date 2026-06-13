import Link from 'next/link';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { HotColdList } from '@/components/stats/HotColdList';
import { NumberFrequencyHeatmap } from '@/components/stats/NumberFrequencyHeatmap';
import { StatsBarChart } from '@/components/stats/StatsBarChart';
import { StatsDisclaimer } from '@/components/stats/StatsDisclaimer';
import { StatsSubNav } from '@/components/stats/StatsSubNav';
import { StatsUnavailable } from '@/components/stats/StatsUnavailable';
import { StatsWindowFilter } from '@/components/stats/StatsWindowFilter';
import { loadStatsPageData, windowQuery } from '@/lib/stats/load-stats-page';

type PageProps = {
  searchParams: { window?: string };
};

export default async function StatsPage({ searchParams }: PageProps) {
  const data = await loadStatsPageData(searchParams.window);
  if (!data) {
    return (
      <StatsPageShell>
        <StatsUnavailable />
      </StatsPageShell>
    );
  }

  const { bundle, window, allDrawCount } = data;
  const wq = windowQuery(window);
  const oddTotal = bundle.oddEven.odd + bundle.oddEven.even || 1;

  return (
    <StatsPageShell>
      <StatsDisclaimer />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StatsSubNav windowQuery={wq} active="/stats" />
        <StatsWindowFilter basePath="/stats" current={window} />
      </div>
      <p className="mt-4 text-sm text-muted">
        분석 {bundle.drawCount}회차
        {bundle.fromDrwNo != null && bundle.toDrwNo != null && (
          <>
            {' '}
            (제{bundle.fromDrwNo}~{bundle.toDrwNo}회)
          </>
        )}
        {window === 0 && allDrawCount > bundle.drawCount && (
          <span> · DB {allDrawCount}회차 중 전체</span>
        )}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">번호별 출현 (당첨 6개)</h2>
        <p className="mt-1 text-xs text-muted">칸을 누르면 번호 상세 통계로 이동</p>
        <div className="mt-4">
          <NumberFrequencyHeatmap
            table={bundle.table}
            maxCount={bundle.maxMain}
            windowQuery={wq}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <HotColdList
          title="자주나온 TOP 10"
          numbers={bundle.hot}
          counts={bundle.freq}
          variant="hot"
          windowQuery={wq}
        />
        <HotColdList
          title="안나온 TOP 10"
          numbers={bundle.cold}
          counts={bundle.freq}
          variant="cold"
          windowQuery={wq}
        />
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-ink">홀·짝 (당첨 6개 합)</h3>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            홀 {((bundle.oddEven.odd / oddTotal) * 100).toFixed(1)}% · 짝{' '}
            {((bundle.oddEven.even / oddTotal) * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-muted">
            홀 {bundle.oddEven.odd}회 / 짝 {bundle.oddEven.even}회
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-ink">저·고 (1~22 / 23~45)</h3>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            저 {bundle.lowHigh.low} · 고 {bundle.lowHigh.high}
          </p>
          <p className="mt-1 text-xs text-muted">당첨번호 6개 기준 누적</p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-bold text-ink">구간별 출현</h2>
        <div className="mt-4">
          <StatsBarChart
            data={bundle.zones.map((z) => ({ label: z.zone, count: z.count }))}
            color="#d97706"
          />
        </div>
      </section>

      <AdSenseSlot slot="stats" />

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/stats/hot-cold${wq}`}
          className="min-h-[44px] rounded-full border-2 border-slate-200 px-5 py-2 text-sm font-semibold text-ink hover:border-gold"
        >
          자주나온/안나온 상세 →
        </Link>
        <Link
          href={`/stats/pattern${wq}`}
          className="min-h-[44px] rounded-full border-2 border-slate-200 px-5 py-2 text-sm font-semibold text-ink hover:border-gold"
        >
          패턴 분석 →
        </Link>
        <Link
          href="/generator"
          className="min-h-[44px] rounded-full bg-brand px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-brand-dark"
        >
          통계 반영 번호 생성
        </Link>
      </div>
    </StatsPageShell>
  );
}

function StatsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        로또 통계
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        동행복권 공식 당첨번호를 바탕으로 번호 출현·분포를 확인합니다. 숫자는{' '}
        <strong className="font-semibold text-ink">과거 당첨 기록(팩트)</strong>이며, 다음
        회차 예측용이 아닙니다.
      </p>
      <div className="mt-8">{children}</div>
    </main>
  );
}
