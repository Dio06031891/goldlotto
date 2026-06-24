import type { Metadata } from 'next';
import Link from 'next/link';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';
import { TaxCalculatorJsonLd } from '@/components/seo/TaxCalculatorJsonLd';

export const metadata: Metadata = {
  title: '로또 세금 계산기 | 1등 실수령액·세후 당첨금 계산',
  description:
    '로또 세금 계산기 — 1·2·3등 당첨금에서 세금을 뺀 실수령액(세후)을 바로 계산. 최신 회차 불러오기, 금액 직접 입력, 200만 비과세·22%·33% 반영.',
  keywords: [
    '로또 세금 계산기',
    '로또 당첨금 계산기',
    '로또 실수령액',
    '로또 1등 세후',
    '복권 세금 계산',
    '당첨금 세금',
  ],
  alternates: { canonical: '/calculator/tax' },
  openGraph: {
    title: '로또 세금 계산기 | 1등 실수령액 계산',
    description: '로또 6/45 당첨금 세금·세후 실수령액을 무료로 계산합니다.',
    url: '/calculator/tax',
  },
};

export default function TaxCalculatorPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <TaxCalculatorJsonLd />
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        로또 세금 계산기
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        <strong className="font-semibold text-ink">로또 당첨금 세금 계산기</strong>로 1등·2등
        등 당첨금의 <strong className="font-semibold text-ink">세후 실수령액</strong>을 확인하세요.
        최신 회차·등수로 불러오거나 금액을 직접 입력할 수 있습니다.
      </p>
      <TaxCalculator />
      <AdSenseSlot slot="tax" />

      <section className="mt-12 space-y-6 border-t border-slate-200 pt-10">
        <h2 className="text-lg font-bold text-ink">로또 세금 계산기 사용 방법</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>「회차·등수」에서 최신 회차 또는 원하는 추첨일·등수를 선택합니다.</li>
          <li>또는 「금액 직접 입력」에 당첨금(세전)을 넣습니다.</li>
          <li>세금과 세후 실수령액이 아래에 표시됩니다.</li>
        </ol>

        <div>
          <h2 className="text-lg font-bold text-ink">자주 묻는 질문</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">로또 1등 세금은 얼마인가요?</dt>
              <dd className="mt-1 leading-relaxed text-muted">
                구입비 1,000원을 제외한 금액 기준, 3억 원 이하는 22%, 초과분은 33%입니다. 200만
                원 이하는 비과세입니다.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">2등·3등도 세금이 있나요?</dt>
              <dd className="mt-1 leading-relaxed text-muted">
                네. 같은 방식으로 계산되며, 등수별 당첨금을 불러와 세후 금액을 확인할 수
                있습니다.
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-sm text-muted">
          세금·수령 절차를 글로 정리한{' '}
          <Link href="/guide/tax" className="font-semibold text-brand underline">
            로또 당첨금 세금 가이드
          </Link>
          도 참고하세요. 계산 결과는 참고용이며, 실제 세액은 관할 세무서 안내를 따릅니다.
        </p>
      </section>
    </main>
  );
}
