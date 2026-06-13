'use client';

import { buildCoupangUrl } from '@/lib/content/coupang-url';
import { formatKRW } from '@/lib/core/format/currency';
import type { LuckyItem } from '@/lib/types/lucky-item';

type Props = {
  item: LuckyItem;
  className?: string;
};

export function CoupangBuyButton({ item, className = '' }: Props) {
  const href = buildCoupangUrl(item.coupangUrl, item.name);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-dark sm:w-auto sm:px-8 ${className}`}
    >
      쿠팡에서 최저가 확인 →
    </a>
  );
}

export function LuckyItemPriceRow({ item }: { item: LuckyItem }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="text-2xl font-extrabold text-ink">{formatKRW(item.price)}</span>
      <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">
        ★ {item.rating.toFixed(1)}
      </span>
    </div>
  );
}
