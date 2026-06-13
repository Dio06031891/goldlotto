import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CoupangDisclaimer } from '@/components/lucky-items/CoupangDisclaimer';
import { LuckyItemCard } from '@/components/lucky-items/LuckyItemCard';
import { getLuckyCategoryBySlug, getLuckyItemsByCategory } from '@/lib/content/lucky-items';
import { LUCKY_CATEGORIES } from '@/lib/content/lucky-items';

type PageProps = { params: { category: string } };

const STATIC = LUCKY_CATEGORIES.filter((c) => c.slug !== 'zodiac').map((c) => ({
  category: c.slug,
}));

export function generateStaticParams() {
  return STATIC;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = getLuckyCategoryBySlug(params.category);
  if (!meta) return { title: '행운템' };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/lucky-items/${meta.slug}` },
  };
}

export default function LuckyCategoryPage({ params }: PageProps) {
  const meta = getLuckyCategoryBySlug(params.category);
  if (!meta || meta.slug === 'zodiac') notFound();

  const items = getLuckyItemsByCategory(meta.category);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link href="/lucky-items" className="text-sm font-semibold text-brand hover:underline">
        ← 행운템
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">{meta.title}</h1>
      <p className="mt-2 text-muted">{meta.description}</p>
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
