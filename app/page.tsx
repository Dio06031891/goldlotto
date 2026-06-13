import Link from 'next/link';
import { Suspense } from 'react';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { LatestDrawSection } from '@/components/lotto/LatestDrawSection';
import { LatestDrawSkeleton } from '@/components/lotto/LatestDrawSkeleton';
import { RecentDrawsPreview } from '@/components/lotto/RecentDrawsPreview';
import { env } from '@/lib/utils/env';

const highlights = [
  {
    title: '세금·실수령액',
    desc: '200만 비과세, 22%·33% 누진을 반영한 세후 금액을 바로 확인합니다.',
    href: '/calculator/tax',
    cta: '세금 계산기',
    tone: 'from-brand to-blue-600',
    soon: false,
  },
  {
    title: '사용 계획 시뮬',
    desc: '세후 당첨금을 주거·차량·위시리스트·투자·기부로 나누고 플랜을 저장합니다.',
    href: '/calculator/spending-plan',
    cta: '사용 계획',
    tone: 'from-gold to-amber-500',
    soon: false,
  },
  {
    title: '번호 생성기',
    desc: '1~45 번호판에서 0~6개 직접 선택 후, 나머지는 통계 추천 5세트.',
    href: '/generator',
    cta: '번호 생성',
    tone: 'from-emerald-600 to-teal-600',
    soon: false,
  },
  {
    title: '당첨번호·통계',
    desc: '동행복권 당첨번호 기준 출현 빈도, 자주나온/안나온, 홀짝·패턴.',
    href: '/stats',
    cta: '통계 보기',
    tone: 'from-slate-700 to-slate-900',
    soon: false,
  },
  {
    title: '판매점·명당',
    desc: '1등 배출 판매점 검색, 내 주변 1·3·5km, 지역별 명당 TOP.',
    href: '/stores',
    cta: '판매점 찾기',
    tone: 'from-rose-600 to-orange-500',
    soon: false,
  },
  {
    title: '가이드',
    desc: '세금·수령·당첨 후 절차를 정리한 읽을거리.',
    href: '/guide',
    cta: '가이드 보기',
    tone: 'from-violet-600 to-purple-600',
    soon: false,
  },
  {
    title: '행운템',
    desc: '쿠팡 실제 상품 22개 — 풍수·부적·크리스탈·이번 주 픽.',
    href: '/lucky-items',
    cta: '행운템 보기',
    tone: 'from-amber-500 to-orange-500',
    soon: false,
  },
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-surface to-amber-50/40">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-bright/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <p className="mb-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold shadow-sm ring-1 ring-gold/30">
            로또 6/45
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            로또 1등,{' '}
            <span className="bg-gradient-to-r from-gold to-gold-bright bg-clip-text text-transparent">
              통장에 찍히는
            </span>{' '}
            진짜 당첨금은?
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {env.SITE_NAME}에서 최신 당첨번호·1등 당첨금(세전)을 확인하고, 세금 떼고{' '}
            <strong className="font-semibold text-ink">실제로 통장에 들어오는 세후 실수령액</strong>
            을 바로 계산할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculator/tax"
              className="inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-full bg-brand px-6 text-base font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
            >
              세금 계산하기
            </Link>
            <Link
              href="/calculator/spending-plan"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-slate-200 bg-white/90 px-6 text-base font-semibold text-ink shadow-sm transition hover:border-gold hover:bg-amber-50/80"
            >
              사용 계획
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<LatestDrawSkeleton />}>
        <LatestDrawSection />
      </Suspense>

      <div className="mx-auto max-w-5xl px-4">
        <AdSenseSlot slot="home" />
      </div>

      <Suspense fallback={null}>
        <RecentDrawsPreview />
      </Suspense>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">무엇을 할 수 있나요?</h2>
        <p className="mt-2 text-sm text-muted sm:text-base">
          로또 번호 확인부터 세후 실수령액 계산, 당첨금 사용 계획까지 한 번에 정리할 수
          있습니다.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <li key={item.title}>
              <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div
                  className={`mb-4 h-1.5 w-14 rounded-full bg-gradient-to-r ${item.tone}`}
                  aria-hidden
                />
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
                {item.soon ? (
                  <span className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-muted">
                    {item.cta}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex min-h-[44px] items-center text-sm font-bold text-brand hover:underline"
                  >
                    {item.cta} →
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
