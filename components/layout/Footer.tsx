import Link from 'next/link';
import { env } from '@/lib/utils/env';
import { isCoupangEnabled } from '@/lib/utils/ad-slots';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-sm text-muted">
      <div className="mx-auto max-w-5xl space-y-6 px-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/lucky-items" className="font-semibold text-amber-800 hover:text-amber-950">
            행운템
          </Link>
          <Link href="/guide" className="hover:text-brand">
            가이드
          </Link>
          <Link href="/about" className="hover:text-brand">
            소개
          </Link>
          <Link href="/contact" className="hover:text-brand">
            문의
          </Link>
          <Link href="/privacy" className="hover:text-brand">
            개인정보
          </Link>
          <Link href="/terms" className="hover:text-brand">
            이용약관
          </Link>
          <Link href="/disclaimer" className="hover:text-brand">
            면책
          </Link>
        </div>
        <p className="leading-relaxed">
          {env.SITE_NAME}는 동행복권 비공식 정보 제공 서비스입니다. 제공 정보는 참고용이며,
          과도한 사행은 일상생활에 지장을 줄 수 있습니다. 복권은 만 19세 이상만 구매할 수
          있습니다.
        </p>
        {isCoupangEnabled() && (
          <p className="text-xs leading-relaxed text-slate-500">
            행운템 링크는 쿠팡 파트너스 활동으로, 구매 시 일정 수수료를 받을 수 있습니다.
          </p>
        )}
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {env.SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
