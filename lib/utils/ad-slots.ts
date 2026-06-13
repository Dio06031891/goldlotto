import { env } from '@/lib/utils/env';

/** AdSense 슬롯 ID — 승인 후 광고 단위별로 발급해 env에 넣습니다 */
export const adSlots = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? '',
  draw: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DRAW ?? '',
  tax: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TAX ?? '',
  stats: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STATS ?? '',
  stores: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STORES ?? '',
  guide: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE ?? '',
  generator: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GENERATOR ?? '',
} as const;

export type AdSlotKey = keyof typeof adSlots;

export function isAdSenseEnabled(): boolean {
  return Boolean(env.ADSENSE_CLIENT_ID?.trim());
}

export function isCoupangEnabled(): boolean {
  return Boolean(env.COUPANG_PARTNERS_ID?.trim());
}
