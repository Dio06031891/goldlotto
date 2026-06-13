import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { LuckyItemsTeaser } from '@/components/lucky-items/LuckyItemsTeaser';
import { DrawJsonLd } from '@/components/seo/DrawJsonLd';
import { DrawPageNav } from '@/components/lotto/DrawPageNav';
import { DrawPrizeTable } from '@/components/lotto/DrawPrizeTable';
import { LottoBallSetFromDraw } from '@/components/lotto/LottoBallSet';
import { afterTax } from '@/lib/core/tax/calculator';
import { formatKoreanAmount, formatKRW } from '@/lib/core/format/currency';
import { getCachedDrawByNo } from '@/lib/lotto/cached-draw-by-no';
import { getCachedLatestDrwNo } from '@/lib/lotto/cached-latest-no';
import { drawPageDescription, drawPageTitle } from '@/lib/lotto/draw-seo';
import { formatYmdKorean } from '@/lib/lotto/draw-format';

/** 빌드 시 최근 N회만 선생성, 나머지는 첫 방문 시 ISR */
const STATIC_PRERENDER_COUNT = 100;

export const revalidate = 86_400;
export const dynamicParams = true;

type PageProps = { params: { no: string } };

function parseDrwNo(raw: string): number | null {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export async function generateStaticParams() {
  const latest = await getCachedLatestDrwNo();
  if (!latest) return [];
  const count = Math.min(STATIC_PRERENDER_COUNT, latest);
  return Array.from({ length: count }, (_, i) => ({
    no: String(latest - i),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const drwNo = parseDrwNo(params.no);
  if (drwNo === null) return { title: '잘못된 회차' };

  const draw = await getCachedDrawByNo(drwNo);
  if (!draw) {
    return {
      title: `로또 ${drwNo}회 | 회차 없음`,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: drawPageTitle(draw),
    description: drawPageDescription(draw),
    alternates: { canonical: `/draw/${draw.drwNo}` },
    openGraph: {
      title: drawPageTitle(draw),
      description: drawPageDescription(draw),
      url: `/draw/${draw.drwNo}`,
    },
  };
}

export default async function DrawPage({ params }: PageProps) {
  const drwNo = parseDrwNo(params.no);
  if (drwNo === null) notFound();

  const [draw, latestNo] = await Promise.all([
    getCachedDrawByNo(drwNo),
    getCachedLatestDrwNo(),
  ]);

  if (!draw) notFound();

  const netFirst = afterTax(draw.firstWinamnt);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <DrawJsonLd draw={draw} />

      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
        로또 6/45 당첨결과
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        제{draw.drwNo}회 당첨번호
      </h1>
      <p className="mt-2 text-base text-muted">{formatYmdKorean(draw.drwNoDate)} 추첨</p>

      <article className="mt-8 overflow-hidden rounded-2xl border-2 border-gold/30 bg-white shadow-lg">
        <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50/80 to-white px-5 py-5 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-ink">당첨번호</p>
          <LottoBallSetFromDraw draw={draw} size="lg" />
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium text-muted">1등 1인당 (세전)</dt>
              <dd className="mt-1 text-lg font-bold tabular-nums text-ink">
                {formatKRW(draw.firstWinamnt)}
              </dd>
            </div>
            <div className="rounded-xl border border-gold/30 bg-amber-50/50 px-4 py-3">
              <dt className="text-xs font-medium text-muted">1등 예상 실수령 (세후)</dt>
              <dd className="mt-1 text-lg font-extrabold tabular-nums text-ink">
                {formatKRW(netFirst)}
              </dd>
              <dd className="mt-0.5 text-xs text-muted">약 {formatKoreanAmount(netFirst)}</dd>
            </div>
          </dl>

          <div>
            <h2 className="mb-3 text-sm font-bold text-ink">등수별 당첨금</h2>
            <DrawPrizeTable draw={draw} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/calculator/tax"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white shadow-md hover:bg-brand-dark"
            >
              1등 세금 계산
            </Link>
            <a
              href={`https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${draw.drwNo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-slate-200 bg-white px-5 text-sm font-semibold text-ink hover:border-gold"
            >
              동행복권 원문
            </a>
          </div>

          <DrawPageNav drwNo={draw.drwNo} latestNo={latestNo} />
        </div>
      </article>

      <AdSenseSlot slot="draw" />
      <LuckyItemsTeaser count={3} />

      <p className="mt-8 text-center text-xs leading-relaxed text-muted">
        당첨 정보는 동행복권 공식 발표를 기준으로 하며, 지연·오류가 있을 수 있습니다.
      </p>
    </main>
  );
}
