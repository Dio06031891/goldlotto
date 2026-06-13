import { HotColdList } from '@/components/stats/HotColdList';
import { StatsDisclaimer } from '@/components/stats/StatsDisclaimer';
import { StatsSubNav } from '@/components/stats/StatsSubNav';
import { StatsUnavailable } from '@/components/stats/StatsUnavailable';
import { StatsWindowFilter } from '@/components/stats/StatsWindowFilter';
import { LottoBall } from '@/components/lotto/LottoBall';
import { loadStatsPageData, windowQuery } from '@/lib/stats/load-stats-page';
import Link from 'next/link';

type PageProps = {
  searchParams: { window?: string };
};

export const metadata = {
  title: '자주나온·안나온 번호 | 로또 통계',
  description:
    '동행복권 당첨번호 기준으로 자주나온 번호(핫)와 안나온 번호(콜드) 순위를 확인합니다.',
  alternates: { canonical: '/stats/hot-cold' },
};

export default async function StatsHotColdPage({ searchParams }: PageProps) {
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
      <h1 className="text-3xl font-extrabold text-ink">자주나온 / 안나온</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        영어로 <strong className="font-semibold text-ink">핫(hot)·콜드(cold)</strong>라고 부르는
        개념입니다.{' '}
        <strong className="font-semibold text-ink">자주나온 = 최근에 당첨번호로 자주 등장</strong>,{' '}
        <strong className="font-semibold text-ink">안나온 = 같은 기간에 거의 안 나온 번호</strong>
        를 뜻합니다. 다음 회차에 더 잘 나온다는 예측이 아니라,{' '}
        <strong className="font-semibold text-ink">지금까지의 출현 횟수 순위</strong>만 보여
        줍니다.
      </p>
      <div className="mt-6">
        <StatsDisclaimer />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StatsSubNav windowQuery={wq} active="/stats/hot-cold" />
        <StatsWindowFilter basePath="/stats/hot-cold" current={window} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <HotColdList
          title="자주나온 (핫)"
          numbers={bundle.hot}
          counts={bundle.freq}
          variant="hot"
          windowQuery={wq}
        />
        <HotColdList
          title="안나온 (콜드)"
          numbers={bundle.cold}
          counts={bundle.freq}
          variant="cold"
          windowQuery={wq}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-bold text-ink">보너스 번호 — 자주나온 순</h2>
        <p className="mt-1 text-xs text-muted">보너스볼(7번째 공)만 따로 집계한 순위입니다.</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {bundle.bonusHot.map((n) => (
            <li key={n}>
              <Link
                href={`/stats/number/${n}${wq}`}
                className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-200 hover:ring-brand"
              >
                <LottoBall num={n} size="sm" />
                <span className="text-sm font-semibold">{n}번</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link href={`/stats${wq}`} className="mt-8 inline-block text-sm font-bold text-brand hover:underline">
        ← 통계 홈
      </Link>
    </main>
  );
}
