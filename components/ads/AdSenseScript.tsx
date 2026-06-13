import Script from 'next/script';
import { env } from '@/lib/utils/env';

/** layout에 1회 삽입. CLIENT_ID 없으면 스크립트 미로드 */
export function AdSenseScript() {
  const clientId = env.ADSENSE_CLIENT_ID?.trim();
  if (!clientId) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
