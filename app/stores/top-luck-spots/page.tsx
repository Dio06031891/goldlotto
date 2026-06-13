import type { Metadata } from 'next';
import Link from 'next/link';
import { StoreCard } from '@/components/stores/StoreCard';
import { getTopLuckStores } from '@/lib/stores/store-repository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '로또 1등 명당 TOP 50 | 당첨 많은 판매점',
  description: '1등 당첨 배출 횟수가 많은 로또 판매점 순위. 전국 명당 리스트와 길찾기.',
  alternates: { canonical: '/stores/top-luck-spots' },
};

export default function TopLuckSpotsPage() {
  const stores = getTopLuckStores(50);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link href="/stores" className="text-sm font-semibold text-brand hover:underline">
        ← 판매점 찾기
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">1등 명당 TOP</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        등록된 데이터 기준 1등 배출 횟수가 많은 순입니다. 과거 실적이 미래 당첨을 보장하지
        않습니다.
      </p>

      <ol className="mt-8 space-y-4">
        {stores.map((store, idx) => (
          <li key={store.id}>
            <p className="mb-2 text-xs font-bold text-gold">#{idx + 1}</p>
            <StoreCard store={store} highlight />
          </li>
        ))}
      </ol>
    </main>
  );
}
