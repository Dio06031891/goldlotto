import type { Metadata } from 'next';
import { SpendingPlanClient } from '@/components/calculator/SpendingPlanClient';

export const metadata: Metadata = {
  title: '로또 당첨금 사용 계획 시뮬레이터',
  description:
    '세후 당첨금을 주거·차량·투자·위시리스트·기부 등으로 나눠 쓰는 시나리오를 저장하고 비교합니다. 브라우저에만 저장됩니다.',
  keywords: ['로또 사용 계획', '당첨금 시뮬', '당첨금 배분', '로또 당첨 후'],
  alternates: { canonical: '/calculator/spending-plan' },
};

export default function SpendingPlanPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        사용 계획 계산기
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        세후 총당첨금을 카테고리별로 나눠 보세요. 작성한 플랜은 서버로 전송되지 않으며, 이
        기기(브라우저)에만 저장됩니다.
      </p>
      <SpendingPlanClient />
    </main>
  );
}
