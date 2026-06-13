'use client';

import dynamic from 'next/dynamic';

const LottoGeneratorTool = dynamic(
  () =>
    import('@/components/generator/LottoGeneratorTool').then((m) => m.LottoGeneratorTool),
  {
    ssr: false,
    loading: () => (
      <p className="mt-10 text-center text-sm text-muted" role="status">
        번호판 불러오는 중…
      </p>
    ),
  }
);

export function LottoGeneratorClient() {
  return <LottoGeneratorTool />;
}
