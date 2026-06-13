import { env } from '@/lib/utils/env';

function searchUrl(query: string, tag?: string): string {
  if (tag) {
    return `https://link.coupang.com/a/${tag}?search=${encodeURIComponent(query)}`;
  }
  return `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}`;
}

/** 쿠팡 파트너스 링크 (딥링크 우선, 없으면 lptag·검색 fallback) */
export function buildCoupangUrl(baseUrl: string, searchFallback: string): string {
  const tag = env.COUPANG_PARTNERS_ID?.trim();

  if (!baseUrl.startsWith('http')) {
    return searchUrl(searchFallback, tag);
  }

  // 파트너스 대시보드에서 복사한 단축 링크 — 그대로 사용
  if (baseUrl.includes('link.coupang.com/a/')) {
    return baseUrl;
  }

  // 쿠팡 상품 URL → 파트너스 딥링크로 감싸기
  if (
    tag &&
    (baseUrl.includes('coupang.com/vp/products') || baseUrl.includes('coupang.com/np/products'))
  ) {
    return `https://link.coupang.com/a/${tag}?redirectUrl=${encodeURIComponent(baseUrl)}`;
  }

  if (tag) {
    try {
      const u = new URL(baseUrl);
      u.searchParams.set('lptag', tag);
      return u.toString();
    } catch {
      return searchUrl(searchFallback, tag);
    }
  }

  return baseUrl;
}
