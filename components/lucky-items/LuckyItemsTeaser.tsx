import Link from 'next/link';
import { resolveItemSlug } from '@/lib/content/lucky-items';
import { getLuckyItemsByCategory } from '@/lib/content/lucky-items';
import { formatKRW } from '@/lib/core/format/currency';

/** 당첨·통계 등 — 행운템 페이지가 아닌 곳에서 쿠팡 크로스셀 (AdSense 대신) */
export function LuckyItemsTeaser({ count = 3 }: { count?: number }) {
  const items = getLuckyItemsByCategory('this-week').slice(0, count);
  if (items.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">🍀 이번 주 행운템</h2>
        <Link href="/lucky-items/this-week" className="text-sm font-semibold text-brand hover:underline">
          전체 보기 →
        </Link>
      </div>
      <p className="mt-1 text-xs text-muted">
        쿠팡 파트너스 링크 · 구매 시 수수료가 발생할 수 있습니다.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/lucky-items/item/${resolveItemSlug(item)}`}
              className="flex h-full flex-col rounded-xl border border-white bg-white p-3 shadow-sm transition hover:border-gold/50 hover:shadow"
            >
              <span className="text-2xl" aria-hidden>
                {item.imageEmoji}
              </span>
              <span className="mt-2 line-clamp-2 text-sm font-semibold text-ink">{item.name}</span>
              <span className="mt-auto pt-2 text-xs font-bold text-ink">{formatKRW(item.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
