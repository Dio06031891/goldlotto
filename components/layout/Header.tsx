import Link from 'next/link';
import { GoldLottoLogo } from '@/components/brand/GoldLottoLogo';
import { env } from '@/lib/utils/env';

const nav = [
  { href: '/draw/latest', label: '당첨번호', soon: false },
  { href: '/stores', label: '판매점', soon: false },
  { href: '/calculator/tax', label: '세금 계산', soon: false },
  { href: '/calculator/spending-plan', label: '사용 계획', soon: false },
  { href: '/generator', label: '번호 생성', soon: false },
  { href: '/stats', label: '통계', soon: false },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink sm:text-xl"
        >
          <GoldLottoLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span>{env.SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {nav.map((item) =>
            item.soon ? (
              <span
                key={item.href}
                className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-muted line-through decoration-muted/60"
                title="준비 중"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-slate-100 hover:text-brand"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <Link
          href="/calculator/tax"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark md:hidden"
        >
          세금 계산
        </Link>
      </div>
    </header>
  );
}
