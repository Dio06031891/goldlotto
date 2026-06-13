import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GuideMarkdown } from '@/components/content/GuideMarkdown';
import { CoupangBuyButton, LuckyItemPriceRow } from '@/components/lucky-items/CoupangBuyButton';
import { CoupangDisclaimer } from '@/components/lucky-items/CoupangDisclaimer';
import { LuckyItemCard } from '@/components/lucky-items/LuckyItemCard';
import { LuckyItemJsonLd } from '@/components/seo/LuckyItemJsonLd';
import {
  getAllLuckyItems,
  getCategoryMetaForItem,
  getDefaultItemBody,
  getLuckyItemBySlug,
  getRelatedLuckyItems,
  resolveItemSlug,
} from '@/lib/content/lucky-items';

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getAllLuckyItems().map((item) => ({ slug: resolveItemSlug(item) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = getLuckyItemBySlug(params.slug);
  if (!item) return { title: '행운템' };
  const cat = getCategoryMetaForItem(item);
  const title = `${item.name} — ${cat?.title ?? '행운템'}`;
  return {
    title,
    description: `${item.description}. 쿠팡 ${formatPrice(item.price)} · 로또 당첨 기분 전환·선물 추천.`,
    alternates: { canonical: `/lucky-items/item/${resolveItemSlug(item)}` },
    openGraph: { title, description: item.description },
  };
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
}

export default function LuckyItemDetailPage({ params }: PageProps) {
  const item = getLuckyItemBySlug(params.slug);
  if (!item) notFound();

  const cat = getCategoryMetaForItem(item);
  const body = item.body?.trim() || getDefaultItemBody(item);
  const related = getRelatedLuckyItems(item);
  const categoryHref =
    item.category === 'zodiac' ? '/lucky-items/zodiac/2026' : `/lucky-items/${item.category}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <LuckyItemJsonLd item={item} />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/lucky-items" className="font-semibold text-brand hover:underline">
          행운템
        </Link>
        <span aria-hidden>·</span>
        {cat && (
          <Link href={categoryHref} className="font-semibold text-brand hover:underline">
            {cat.title}
          </Link>
        )}
      </nav>

      <header className="mt-6">
        {item.imageUrl ? (
          <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 384px"
              unoptimized
            />
          </div>
        ) : (
          <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-amber-100 text-8xl">
            {item.imageEmoji}
          </div>
        )}
        <h1 className="mt-8 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {item.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{item.description}</p>
        <div className="mt-5">
          <LuckyItemPriceRow item={item} />
        </div>
        <div className="mt-6">
          <CoupangBuyButton item={item} />
        </div>
      </header>

      <div className="mt-6">
        <CoupangDisclaimer />
      </div>

      <GuideMarkdown content={body} />

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
        <p className="text-sm leading-relaxed text-amber-950">
          가격·재고·배송은 <strong>쿠팡 상품 페이지</strong>에서 확인하세요. 본 추천은 당첨을
          보장하지 않으며, 과도한 구매는 자제해 주세요.
        </p>
        <div className="mt-4">
          <CoupangBuyButton item={item} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-ink">같은 카테고리 추천</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <LuckyItemCard item={r} compact />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
