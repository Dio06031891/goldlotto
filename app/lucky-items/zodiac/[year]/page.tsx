import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CoupangDisclaimer } from '@/components/lucky-items/CoupangDisclaimer';
import { LuckyItemCard } from '@/components/lucky-items/LuckyItemCard';
import { getLuckyItemsByCategory } from '@/lib/content/lucky-items';

type PageProps = { params: { year: string } };

export function generateStaticParams() {
  return [{ year: '2026' }, { year: '2025' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const year = params.year;
  return {
    title: `${year}년 띠별 행운템 | 로또·개운 소품`,
    description: `${year}년에 맞춘 띠별 행운템 추천.`,
    alternates: { canonical: `/lucky-items/zodiac/${year}` },
  };
}

export default function LuckyZodiacYearPage({ params }: PageProps) {
  const year = parseInt(params.year, 10);
  if (!Number.isFinite(year) || year < 2020 || year > 2030) notFound();

  const items = getLuckyItemsByCategory('zodiac');

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link href="/lucky-items" className="text-sm font-semibold text-brand hover:underline">
        ← 행운템
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">{year}년 띠별 행운템</h1>
      <p className="mt-2 text-muted">올해 띠에 맞춘 추천 아이템 (참고용 큐레이션)</p>
      <div className="mt-6">
        <CoupangDisclaimer />
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <LuckyItemCard item={item} />
          </li>
        ))}
      </ul>
    </main>
  );
}
