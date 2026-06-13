import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/lib/content/guides';

export const metadata: Metadata = {
  title: '로또 가이드 | 세금·수령·당첨 후',
  description: '로또 6/45 당첨금 세금, 수령 방법, 당첨 후 체크리스트, 당첨자 이야기를 정리한 가이드 모음.',
  alternates: { canonical: '/guide' },
};

export default function GuideIndexPage() {
  const guides = getAllGuides();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">로또 가이드</h1>
      <p className="mt-3 text-base text-muted">
        세금·수령·당첨 후 준비를 차근차근 정리했습니다. 최종 판단은 관할 기관·전문가 상담을
        따르세요.
      </p>
      <ul className="mt-10 space-y-4">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-ink">{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{g.description}</p>
              <p className="mt-3 text-xs font-semibold text-brand">확인하기 →</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
