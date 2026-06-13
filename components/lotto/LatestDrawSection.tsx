import Link from 'next/link';
import { LottoBallSetFromDraw } from '@/components/lotto/LottoBallSet';
import { afterTax } from '@/lib/core/tax/calculator';
import { formatKoreanAmount, formatKRW } from '@/lib/core/format/currency';
import { getCachedLatestDraw } from '@/lib/lotto/cached-draw';
import { formatYmdKorean, nextDrawCountdownLabel } from '@/lib/lotto/draw-format';

export async function LatestDrawSection() {
  const draw = await getCachedLatestDraw();

  if (!draw) {
    return (
      <section
        className="mx-auto max-w-5xl px-4 pb-8"
        aria-label="최신 회차"
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-sm text-amber-900">
          <p className="font-semibold">당첨 정보를 불러오지 못했습니다</p>
          <p className="mt-2 text-amber-800/90">
            동행복권 서버 연결이 잠시 불안정할 수 있습니다.{' '}
            <Link href="/calculator/tax" className="font-bold underline">
              세금 계산기
            </Link>
            에서 회차를 직접 지정하거나 금액을 입력해 보세요.
          </p>
        </div>
      </section>
    );
  }

  const netFirst = afterTax(draw.firstWinamnt);

  return (
    <section className="mx-auto max-w-5xl px-4 pb-10" aria-label="최신 회차">
      <article className="overflow-hidden rounded-2xl border-2 border-gold/40 bg-white shadow-lg">
        <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50/90 to-white px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                최신 추첨
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
                제{draw.drwNo}회
                <span className="mx-2 font-bold text-muted">·</span>
                <span className="text-lg font-bold text-muted sm:text-xl">
                  {formatYmdKorean(draw.drwNoDate)}
                </span>
              </h2>
            </div>
            <p className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-muted">
              {nextDrawCountdownLabel()}
            </p>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">당첨번호</p>
            <LottoBallSetFromDraw draw={draw} size="lg" />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium text-muted">1등 1인당 (세전)</dt>
              <dd className="mt-1 text-lg font-bold tabular-nums text-ink">
                {formatKRW(draw.firstWinamnt)}
              </dd>
              {draw.firstWinnerCount !== undefined && (
                <dd className="mt-0.5 text-xs text-muted">
                  당첨 {draw.firstWinnerCount.toLocaleString('ko-KR')}명
                </dd>
              )}
            </div>
            <div className="rounded-xl border border-gold/30 bg-amber-50/50 px-4 py-3">
              <dt className="text-xs font-medium text-muted">1등 예상 실수령 (세후)</dt>
              <dd className="mt-1 text-lg font-extrabold tabular-nums text-ink">
                {formatKRW(netFirst)}
              </dd>
              <dd className="mt-0.5 text-xs text-muted">약 {formatKoreanAmount(netFirst)}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/draw/${draw.drwNo}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-gold/60 bg-white px-5 text-sm font-bold text-ink shadow-sm hover:bg-amber-50/80"
            >
              회차 상세 보기
            </Link>
            <Link
              href="/calculator/tax"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white shadow-md hover:bg-brand-dark"
            >
              이 회차로 세금 계산
            </Link>
            <a
              href={`https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${draw.drwNo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-slate-200 bg-white px-5 text-sm font-semibold text-ink hover:border-gold"
            >
              동행복권 결과 보기
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
