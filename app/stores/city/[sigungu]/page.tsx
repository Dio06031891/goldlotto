import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StoreCard } from '@/components/stores/StoreCard';
import { findSidoBySlug, parseSigunguSlug } from '@/lib/stores/korea-regions';
import { getStoresBySigungu } from '@/lib/stores/store-repository';

type PageProps = { params: { sigungu: string } };

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsed = parseSigunguSlug(params.sigungu);
  if (!parsed) return { title: '시군구 판매점' };
  const sido = findSidoBySlug(parsed.sidoSlug);
  return {
    title: `${sido?.shortName ?? ''} ${parsed.sigunguKey} 로또 판매점`,
    alternates: { canonical: `/stores/city/${params.sigungu}` },
  };
}

export default function StoresCityPage({ params }: PageProps) {
  const parsed = parseSigunguSlug(params.sigungu);
  if (!parsed) notFound();

  const sido = findSidoBySlug(parsed.sidoSlug);
  if (!sido) notFound();

  const stores = getStoresBySigungu(parsed.sidoSlug, parsed.sigunguKey);
  const label = stores[0]?.sigungu ?? parsed.sigunguKey;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link
        href={`/stores/region/${parsed.sidoSlug}`}
        className="text-sm font-semibold text-brand hover:underline"
      >
        ← {sido.shortName}
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">{label} 로또 명당</h1>
      <p className="mt-2 text-sm text-muted">{stores.length}곳</p>

      <ul className="mt-8 space-y-4">
        {stores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} />
          </li>
        ))}
      </ul>

      {stores.length === 0 && (
        <p className="mt-8 text-sm text-muted">등록된 명당이 없습니다.</p>
      )}
    </main>
  );
}
