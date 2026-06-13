import type { Metadata } from 'next';

import Link from 'next/link';

import { CoupangDisclaimer } from '@/components/lucky-items/CoupangDisclaimer';

import { LUCKY_CATEGORIES, getAllLuckyItems, getLuckyItemsByCategory } from '@/lib/content/lucky-items';



export const metadata: Metadata = {

  title: '행운템 | 로또 당첨 기원 쇼핑 큐레이션',

  description:

    '쿠팡 실제 상품 22개 — 풍수·부적·크리스탈·띠별·이번 주 픽. 로또 구매 전후 개운 소품.',

  alternates: { canonical: '/lucky-items' },

};



export default function LuckyItemsIndexPage() {

  const withLink = getAllLuckyItems().filter((i) => i.coupangUrl?.includes('coupang.com')).length;



  return (

    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">

      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">행운템</h1>

      <p className="mt-3 text-base leading-relaxed text-muted">

        로또·복권 구매 전후에 많이 찾는 개운·풍수 소품입니다.{' '}

        <strong className="font-semibold text-ink">쿠팡 상품 {withLink}개</strong>

        를 카테고리별로 모아 두었습니다.

      </p>



      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-950">

        카드를 누르면 상품 설명과 쿠팡 구매 페이지로 이동합니다. 가격·구성은 쿠팡 페이지 기준입니다.

      </div>



      <div className="mt-6 flex flex-wrap gap-3">

        <Link

          href="/lucky-items/this-week"

          className="min-h-[44px] rounded-full bg-brand px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-brand-dark"

        >

          이번 주 픽 →

        </Link>

        <Link

          href="/lucky-items/feng-shui"

          className="min-h-[44px] rounded-full border-2 border-slate-200 px-5 py-2 text-sm font-semibold text-ink hover:border-gold"

        >

          풍수·개운 소품

        </Link>

      </div>



      <div className="mt-6">

        <CoupangDisclaimer />

      </div>



      <ul className="mt-10 grid gap-4 sm:grid-cols-2">

        {LUCKY_CATEGORIES.map((c) => {

          const count = getLuckyItemsByCategory(c.category).length;

          return (

            <li key={c.slug}>

              <Link

                href={

                  c.slug === 'zodiac'

                    ? '/lucky-items/zodiac/2026'

                    : `/lucky-items/${c.slug}`

                }

                className="block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-gold"

              >

                <div className="flex items-start justify-between gap-2">

                  <h2 className="font-bold text-ink">{c.title}</h2>

                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">

                    {count}개

                  </span>

                </div>

                <p className="mt-2 text-sm text-muted">{c.description}</p>

              </Link>

            </li>

          );

        })}

      </ul>

    </main>

  );

}

