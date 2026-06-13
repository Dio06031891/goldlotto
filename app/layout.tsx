import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AdSenseScript } from '@/components/ads/AdSenseScript';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { env } from '@/lib/utils/env';

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: '황금로또 | 로또 6/45 당첨번호 + 세금계산기 + 사용계획',
    template: '%s | 황금로또',
  },
  description:
    '이번 주 로또 6/45 당첨번호 즉시 확인. 세전·세후 당첨금 계산, 1등 실수령액, 사용 계획 시뮬레이터까지 한 번에.',
  keywords: [
    '로또',
    '로또 6/45',
    '로또 당첨번호',
    '로또 세금 계산기',
    '당첨금 계산',
    '사용 계획',
    '명당',
    '번호 생성기',
  ],
  authors: [{ name: env.SITE_NAME }],
  creator: env.SITE_NAME,
  publisher: env.SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: env.SITE_URL,
    title: '황금로또 | 로또 6/45 당첨번호 + 세금계산기',
    description: '당첨번호 확인부터 세후 실수령액, 사용 계획까지',
    siteName: env.SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: '황금로또',
    description: '로또 6/45 당첨번호 + 세금계산기',
  },
  verification: {
    google: env.GOOGLE_VERIFY || undefined,
    other: env.NAVER_VERIFY
      ? { 'naver-site-verification': env.NAVER_VERIFY }
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: env.SITE_URL,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffd700',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <GoogleAnalytics />
        <AdSenseScript />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
