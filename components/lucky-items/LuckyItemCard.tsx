import Link from 'next/link';
import { resolveItemSlug } from '@/lib/content/lucky-items';
import { formatKRW } from '@/lib/core/format/currency';
import type { LuckyItem } from '@/lib/types/lucky-item';

type Props = {
  item: LuckyItem;
  /** 목록 카드: 상세 링크 + 작은 CTA */
  compact?: boolean;
};

export function LuckyItemCard({ item, compact = false }: Props) {
  const detailHref = `/lucky-items/item/${resolveItemSlug(item)}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={detailHref}
        className={`flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 text-5xl hover:from-amber-100 hover:to-amber-200 ${compact ? 'h-24' : 'h-32'}`}
      >
        {item.imageEmoji}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={detailHref} className="font-bold text-ink hover:text-brand">
          <h3>{item.name}</h3>
        </Link>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-ink">{formatKRW(item.price)}</span>
          <span className="text-amber-700">★ {item.rating.toFixed(1)}</span>
        </div>
        <Link
          href={detailHref}
          className={`mt-4 flex min-h-[44px] items-center justify-center rounded-xl text-sm font-bold ${
            compact
              ? 'border border-brand text-brand hover:bg-brand/5'
              : 'bg-brand text-white hover:bg-brand-dark'
          }`}
        >
          {compact ? '자세히 보기' : '상세 보기 →'}
        </Link>
      </div>
    </article>
  );
}
