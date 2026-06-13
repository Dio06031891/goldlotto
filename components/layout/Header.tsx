import Link from 'next/link';
import { GoldLottoLogo } from '@/components/brand/GoldLottoLogo';
import { env } from '@/lib/utils/env';

const nav = [
  { href: '/lucky-items', label: '행운템', accent: true },
  { href: '/draw/latest', label: '당첨번호' },
  { href: '/stores', label: '판매점' },
  { href: '/calculator/tax', label: '세금 계산' },
  { href: '/calculator/spending-plan', label: '사용 계획' },
  { href: '/generator', label: '번호 생성' },
  { href: '/stats', label: '통계' },
] as const;

function NavLink({
  href,
  label,
  accent,
  compact,
}: {
  href: string;
  label: string;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
        accent
          ? 'bg-gradient-to-r from-amber-100 to-amber-50 font-bold text-amber-950 ring-1 ring-amber-200/80 hover:from-amber-200 hover:to-amber-100'
          : 'text-ink hover:bg-slate-100 hover:text-brand'
      } ${compact ? 'text-xs' : ''}`}
    >
      {accent ? `🍀 ${label}` : label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight text-ink sm:text-xl"
        >
          <GoldLottoLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
          <span>{env.SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} accent={'accent' in item ? item.accent : false} />
          ))}
        </nav>
        <Link
          href="/lucky-items"
          className="shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:from-amber-600 hover:to-amber-700 md:hidden"
        >
          🍀 행운템
        </Link>
      </div>
      <nav
        className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2 md:hidden"
        aria-label="주요 메뉴"
      >
        {nav.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} accent={item.accent} compact />
        ))}
      </nav>
    </header>
  );
}
