import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { drawPageDescription, drawPageTitle } from '@/lib/lotto/draw-seo';
import { env } from '@/lib/utils/env';

export function DrawJsonLd({ draw }: { draw: DhLotteryDrawJson }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: drawPageTitle(draw),
    description: drawPageDescription(draw),
    datePublished: draw.drwNoDate,
    author: {
      '@type': 'Organization',
      name: env.SITE_NAME,
      url: env.SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${env.SITE_URL}/draw/${draw.drwNo}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
