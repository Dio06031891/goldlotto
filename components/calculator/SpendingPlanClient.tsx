'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SpendingPlanCalculator = dynamic(
  () =>
    import('@/components/calculator/SpendingPlanCalculator').then(
      (m) => m.SpendingPlanCalculator
    ),
  {
    ssr: false,
    loading: () => (
      <p className="mt-10 text-center text-sm text-muted" role="status">
        계산기 불러오는 중…
      </p>
    ),
  }
);

function SpendingPlanFallback() {
  return (
    <p className="mt-10 text-center text-sm text-muted" role="status">
      불러오는 중…
    </p>
  );
}

export function SpendingPlanClient() {
  return (
    <Suspense fallback={<SpendingPlanFallback />}>
      <SpendingPlanCalculator />
    </Suspense>
  );
}
