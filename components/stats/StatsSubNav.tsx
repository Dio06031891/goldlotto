import Link from 'next/link';

const links = [
  { href: '/stats', label: '종합' },
  { href: '/stats/hot-cold', label: '자주나온/안나온' },
  { href: '/stats/pattern', label: '패턴' },
] as const;

type Props = {
  windowQuery: string;
  active: (typeof links)[number]['href'];
};

export function StatsSubNav({ windowQuery, active }: Props) {
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="통계 하위 메뉴"
    >
      {links.map((item) => {
        const href = `${item.href}${windowQuery}`;
        const isOn = active === item.href;
        return (
          <Link
            key={item.href}
            href={href}
            className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold transition ${
              isOn
                ? 'bg-brand text-white shadow-md'
                : 'border-2 border-slate-200 bg-white text-ink hover:border-gold'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
