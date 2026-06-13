import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StoreCard } from '@/components/stores/StoreCard';
import { findSidoBySlug } from '@/lib/stores/korea-regions';
import { getStoresBySido, listSigunguInSido } from '@/lib/stores/store-repository';

type PageProps = { params: { sido: string } };

/** 명당 JSON(수천 건)을 빌드 시 17회 읽지 않도록 런타임 렌더 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sido = findSidoBySlug(params.sido);
  if (!sido) return { title: '지역 판매점' };
  return {
    title: `${sido.shortName} 로또 판매점·1등 명당`,
    description: `${sido.name} 지역 로또 6/45 1등 배출 판매점 목록.`,
    alternates: { canonical: `/stores/region/${params.sido}` },
  };
}

export default function StoresRegionPage({ params }: PageProps) {
  const sido = findSidoBySlug(params.sido);
  if (!sido) notFound();

  const allInSido = getStoresBySido(sido);
  const stores = allInSido.slice(0, 80);
  const cities = listSigunguInSido(sido);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link href="/stores" className="text-sm font-semibold text-brand hover:underline">
        ← 판매점 찾기
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">{sido.shortName} 로또 명당</h1>
      <p className="mt-2 text-sm text-muted">
        {sido.name} · 1등 이력 {allInSido.length}곳
        {allInSido.length > stores.length
          ? ` (배출 횟수 상위 ${stores.length}곳만 표시)`
          : ''}
      </p>

      {cities.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold text-ink">시·군·구별</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/stores/city/${c.slug}`}
                  className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:border-gold"
                >
                  {c.name} ({c.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="mt-8 space-y-4">
        {stores.map((store) => (
          <li key={store.id}>
            <StoreCard store={store} />
          </li>
        ))}
      </ul>

      {allInSido.length > stores.length && (
        <p className="mt-6 text-sm text-muted">
          전체 목록은{' '}
          <Link href="/stores" className="font-bold text-brand underline">
            판매점 검색
          </Link>
          에서 지역명으로 찾아보세요.
        </p>
      )}

      {allInSido.length === 0 && (
        <p className="mt-8 text-sm text-muted">
          이 지역 데이터가 아직 없습니다.{' '}
          <Link href="/stores" className="font-bold text-brand underline">
            전국 검색
          </Link>
          을 이용해 주세요.
        </p>
      )}
    </main>
  );
}
