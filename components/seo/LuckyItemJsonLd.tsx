import { buildCoupangUrl } from '@/lib/content/coupang-url';
import { resolveItemSlug } from '@/lib/content/lucky-items';
import { env } from '@/lib/utils/env';
import type { LuckyItem } from '@/lib/types/lucky-item';

export function LuckyItemJsonLd({ item }: { item: LuckyItem }) {
  const slug = resolveItemSlug(item);
  const url = `${env.SITE_URL.replace(/\/$/, '')}/lucky-items/item/${slug}`;
  const buyUrl = buildCoupangUrl(item.coupangUrl, item.name);

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    url,
    image: item.imageUrl || undefined,
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'KRW',
      url: buyUrl,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item.rating,
      bestRating: 5,
      ratingCount: Math.max(10, Math.round(item.rating * 20)),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
