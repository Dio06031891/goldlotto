import fs from 'node:fs';
import path from 'node:path';
import type { LuckyItem, LuckyItemCategory } from '@/lib/types/lucky-item';

const DATA_DIR = path.join(process.cwd(), 'content', 'lucky-items');
const JSON_FILES = ['feng-shui', 'charms', 'crystal', 'zodiac', 'this-week'] as const;

export const LUCKY_CATEGORIES = [
  {
    slug: 'feng-shui',
    title: '풍수·개운 소품',
    description: '재물·행운 상징으로 많이 찾는 풍수 아이템',
    category: 'feng-shui' as const,
  },
  {
    slug: 'charms',
    title: '부적·키링',
    description: '휴대하기 좋은 부적·키홀더·미니 부적',
    category: 'charms' as const,
  },
  {
    slug: 'crystal',
    title: '크리스탈·원석',
    description: '탁자·차량용 포인트 소품',
    category: 'crystal' as const,
  },
  {
    slug: 'zodiac',
    title: '띠별 행운템',
    description: '올해 띠에 맞춘 추천 아이템',
    category: 'zodiac' as const,
  },
  {
    slug: 'this-week',
    title: '이번 주 픽',
    description: '이번 주에 인기 있는 행운템 모음',
    category: 'this-week' as const,
  },
] as const;

function loadJsonFile(file: string): LuckyItem[] {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) return [];
  const raw = JSON.parse(fs.readFileSync(full, 'utf-8')) as LuckyItem[];
  return raw;
}

export function resolveItemSlug(item: LuckyItem): string {
  return item.slug?.trim() || item.id;
}

let cachedAll: LuckyItem[] | null = null;

export function getAllLuckyItems(): LuckyItem[] {
  if (cachedAll) return cachedAll;
  const all = JSON_FILES.flatMap((f) => loadJsonFile(`${f}.json`));
  const seen = new Set<string>();
  cachedAll = all.filter((item) => {
    const slug = resolveItemSlug(item);
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
  return cachedAll;
}

export function getLuckyItemBySlug(slug: string): LuckyItem | undefined {
  return getAllLuckyItems().find((i) => resolveItemSlug(i) === slug);
}

export function getLuckyItemsByCategory(category: LuckyItemCategory): LuckyItem[] {
  const file = `${category}.json`;
  return loadJsonFile(file);
}

export function getLuckyCategoryBySlug(slug: string) {
  return LUCKY_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryMetaForItem(item: LuckyItem) {
  return LUCKY_CATEGORIES.find((c) => c.category === item.category);
}

export function getRelatedLuckyItems(item: LuckyItem, limit = 3): LuckyItem[] {
  return getLuckyItemsByCategory(item.category)
    .filter((i) => i.id !== item.id)
    .slice(0, limit);
}

export function getDefaultItemBody(item: LuckyItem): string {
  const cat = getCategoryMetaForItem(item);
  return `${item.description}

## ${item.name} — 로또 구매 전 작은 의식

${cat?.title ?? '행운템'} 카테고리에서 많이 찾는 아이템입니다. 당첨을 보장하지는 않지만, **복권을 사기 전 기분을 환기**하거나 **당첨 후 선물**로도 많이 쓰입니다.

## 구매 전 참고

- 가격·리뷰는 등록 시점 기준이며 **쿠팡에서 최종 확인**하세요.
- 본 페이지는 쿠팡 파트너스 제휴 링크를 포함합니다.
`;
}

export function getZodiacItems(year: number): LuckyItem[] {
  const all = loadJsonFile('zodiac.json');
  return all.filter((i) => i.id.includes(String(year)) || year >= 2026);
}
