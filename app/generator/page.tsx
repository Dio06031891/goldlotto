import type { Metadata } from 'next';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { LottoGeneratorClient } from '@/components/generator/LottoGeneratorClient';

export const metadata: Metadata = {
  title: '무료 로또 번호 생성기 | 번호 직접 선택 + 통계 추천',
  description:
    '동행복권 구매처럼 1~45에서 원하는 만큼 번호를 고르고, 나머지는 최근 당첨 통계로 5세트 추천받습니다.',
  keywords: ['로또 번호 생성기', '로또 자동 번호', '로또 번호 선택', '로또 6/45'],
  alternates: { canonical: '/generator' },
};

export default function GeneratorPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:max-w-xl sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        로또 번호 생성기
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        번호를 <strong className="font-semibold text-ink">0~6개</strong>까지 직접 고를 수
        있습니다. 고르지 않은 칸은 통계 추천으로 채워 5세트를 만들어 드립니다.
      </p>
      <LottoGeneratorClient />
      <AdSenseSlot slot="generator" />
    </main>
  );
}
