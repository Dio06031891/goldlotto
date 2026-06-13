export type LuckyItemCategory =
  | 'feng-shui'
  | 'charms'
  | 'crystal'
  | 'zodiac'
  | 'this-week';

export type LuckyItem = {
  id: string;
  /** URL: /lucky-items/item/{slug} — 없으면 id 사용 */
  slug?: string;
  name: string;
  price: number;
  rating: number;
  /** 쿠팡 상품 이미지 URL (없으면 imageEmoji) */
  imageUrl?: string;
  imageEmoji: string;
  /** 파트너스 대시보드에서 복사한 딥링크 (link.coupang.com/a/...) */
  coupangUrl: string;
  /** 카드 한 줄 설명 */
  description: string;
  /** 상세페이지 본문 (마크다운) — 없으면 description + 기본 안내 */
  body?: string;
  category: LuckyItemCategory;
  /** SEO 키워드 */
  tags?: string[];
};

export type LuckyCategoryMeta = {
  slug: string;
  title: string;
  description: string;
  category: LuckyItemCategory;
};
