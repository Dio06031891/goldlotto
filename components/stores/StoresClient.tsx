'use client';

import dynamic from 'next/dynamic';
import type { LottoStore } from '@/lib/types/store';

const StoreFinder = dynamic(
  () => import('@/components/stores/StoreFinder').then((m) => m.StoreFinder),
  {
    ssr: false,
    loading: () => (
      <p className="text-center text-sm text-muted" role="status">
        지도·목록 불러오는 중…
      </p>
    ),
  }
);

export function StoresClient({
  initialStores,
  totalStores,
}: {
  initialStores: LottoStore[];
  totalStores?: number;
}) {
  return <StoreFinder initialStores={initialStores} totalStores={totalStores} />;
}
