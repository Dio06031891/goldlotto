export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3040',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? '황금로또',
  ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '',
  COUPANG_PARTNERS_ID: process.env.NEXT_PUBLIC_COUPANG_PARTNERS_ID ?? '',
  GA_ID: process.env.NEXT_PUBLIC_GA_ID ?? '',
  NAVER_VERIFY: process.env.NEXT_PUBLIC_NAVER_VERIFY ?? '',
  GOOGLE_VERIFY: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ?? '',
} as const;
