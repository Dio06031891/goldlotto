import type { GuideDoc } from '@/lib/content/guides';
import { env } from '@/lib/utils/env';

export function GuideJsonLd({ guide }: { guide: GuideDoc }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: 'ko-KR',
    author: { '@type': 'Organization', name: env.SITE_NAME },
    publisher: { '@type': 'Organization', name: env.SITE_NAME, url: env.SITE_URL },
    mainEntityOfPage: `${env.SITE_URL}/guide/${guide.slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
