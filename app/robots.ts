import type { MetadataRoute } from 'next';
import { env } from '@/lib/utils/env';

export default function robots(): MetadataRoute.Robots {
  const base = env.SITE_URL.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
