import type { SpendingCategory } from '@/lib/types/spending';

export const SINGLE_CATEGORIES = [
  'housing',
  'vehicle',
  'finance',
  'realEstate',
  'donation',
] as const satisfies readonly SpendingCategory[];

export type SingleSpendingCategory = (typeof SINGLE_CATEGORIES)[number];

export const CATEGORY_META: Record<
  SpendingCategory,
  { label: string; icon: string; hint: string }
> = {
  housing: { label: '주거(집)', icon: '🏠', hint: '집·전세·리모델링 등' },
  vehicle: { label: '이동(차)', icon: '🚗', hint: '차량·렌트·유지비 등' },
  wishlist: { label: '위시리스트', icon: '✨', hint: '하고 싶은 것 무제한 추가' },
  finance: { label: '금융투자', icon: '📈', hint: '주식·펀드·예금 등' },
  realEstate: { label: '부동산투자', icon: '🏢', hint: '임대·상가·토지 등' },
  donation: { label: '기부·가족', icon: '💝', hint: '기부·부모님·자녀 지원 등' },
  reserve: { label: '여유자금', icon: '💰', hint: '남은 금액 (자동)' },
};
