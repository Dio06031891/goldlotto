import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '로또 6/45 통계 | 번호 출현·자주나온/안나온·패턴',
  description:
    '동행복권 공식 당첨번호 기준 출현 빈도, 자주나온·안나온 번호, 홀짝·구간 패턴. 과거 기록 참고용.',
  alternates: { canonical: '/stats' },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
