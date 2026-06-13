import type { Metadata } from 'next';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';

export const metadata: Metadata = {
  title: '로또 당첨금 세금 계산기 | 1등 실수령액',
  description:
    '최신 회차·등수로 동행복권 공개 당첨금을 불러오거나 금액 직접 입력으로 로또 1등 세금·실수령액을 계산합니다.',
  keywords: ['로또 세금 계산기', '당첨금 세금', '로또 실수령액', '복권 세금'],
  alternates: { canonical: '/calculator/tax' },
};

export default function TaxCalculatorPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        로또 세금 계산기
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        최신 회차·등수로 당첨금을 불러오거나, 금액 직접 입력으로 세금과 세후 실수령액을
        바로 확인할 수 있습니다.
      </p>
      <TaxCalculator />
      <AdSenseSlot slot="tax" />
    </main>
  );
}
