import fs from 'node:fs';
import path from 'node:path';

export const GUIDE_SLUGS = [
  'tax',
  'how-to-claim',
  'after-winning',
  'winner-stories',
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type GuideDoc = {
  slug: GuideSlug;
  title: string;
  description: string;
  readMinutes: number;
  body: string;
};

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides');

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw.trim());
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2] };
}

export function getAllGuides(): GuideDoc[] {
  return GUIDE_SLUGS.map((slug) => getGuideBySlug(slug)).filter((g): g is GuideDoc => g !== null);
}

export function getGuideBySlug(slug: string): GuideDoc | null {
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) return null;
  const file = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug: slug as GuideSlug,
    title: meta.title ?? slug,
    description: meta.description ?? '',
    readMinutes: parseInt(meta.readMinutes ?? '5', 10) || 5,
    body,
  };
}
