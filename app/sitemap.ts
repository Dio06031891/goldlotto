import type { MetadataRoute } from 'next';
import { getAllLuckyItems, resolveItemSlug } from '@/lib/content/lucky-items';
import { getCachedLatestDrwNo } from '@/lib/lotto/cached-latest-no';
import { getCachedSchedule } from '@/lib/lotto/cached-schedule';
import { SIDO_LIST } from '@/lib/stores/korea-regions';
import { env } from '@/lib/utils/env';

const base = env.SITE_URL.replace(/\/$/, '');

const staticRoutes: MetadataRoute.Sitemap = [
  { url: base, changeFrequency: 'daily', priority: 1 },
  { url: `${base}/calculator/tax`, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${base}/calculator/spending-plan`, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${base}/generator`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${base}/stats`, changeFrequency: 'daily', priority: 0.85 },
  { url: `${base}/stats/hot-cold`, changeFrequency: 'daily', priority: 0.75 },
  { url: `${base}/stats/pattern`, changeFrequency: 'daily', priority: 0.75 },
  { url: `${base}/stores`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${base}/stores/top-luck-spots`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${base}/guide`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${base}/guide/tax`, changeFrequency: 'monthly', priority: 0.75 },
  { url: `${base}/guide/how-to-claim`, changeFrequency: 'monthly', priority: 0.75 },
  { url: `${base}/guide/after-winning`, changeFrequency: 'monthly', priority: 0.75 },
  { url: `${base}/guide/winner-stories`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/lucky-items`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${base}/lucky-items/feng-shui`, changeFrequency: 'weekly', priority: 0.65 },
  { url: `${base}/lucky-items/charms`, changeFrequency: 'weekly', priority: 0.65 },
  { url: `${base}/lucky-items/crystal`, changeFrequency: 'weekly', priority: 0.65 },
  { url: `${base}/lucky-items/this-week`, changeFrequency: 'weekly', priority: 0.65 },
  { url: `${base}/lucky-items/zodiac/2026`, changeFrequency: 'weekly', priority: 0.65 },
  { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.4 },
  { url: `${base}/draw/latest`, changeFrequency: 'daily', priority: 0.95 },
  { url: `${base}/about`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${base}/disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const schedule = await getCachedSchedule();
  const latest = await getCachedLatestDrwNo();

  let drawNos: number[] = [];
  if (schedule?.length) {
    drawNos = schedule.map((e) => e.drwNo);
  } else if (latest) {
    drawNos = Array.from({ length: latest }, (_, i) => i + 1);
  }

  const drawEntries: MetadataRoute.Sitemap = drawNos.map((no) => ({
    url: `${base}/draw/${no}`,
    changeFrequency: 'never' as const,
    priority: no === latest ? 0.85 : 0.55,
    lastModified: undefined,
  }));

  const numberStats: MetadataRoute.Sitemap = Array.from({ length: 45 }, (_, i) => ({
    url: `${base}/stats/number/${i + 1}`,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const storeRegions: MetadataRoute.Sitemap = SIDO_LIST.map((s) => ({
    url: `${base}/stores/region/${s.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  const luckyItems: MetadataRoute.Sitemap = getAllLuckyItems().map((item) => ({
    url: `${base}/lucky-items/item/${resolveItemSlug(item)}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...drawEntries, ...numberStats, ...storeRegions, ...luckyItems];
}
