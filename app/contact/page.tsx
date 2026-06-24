import type { Metadata } from 'next';
import Link from 'next/link';
import { env } from '@/lib/utils/env';

export const metadata: Metadata = {
  title: '문의하기',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-ink">문의하기</h1>
      <p className="mt-4 leading-relaxed text-muted">
        {env.SITE_NAME} 서비스 이용·제휴·오류 제보는 아래로 연락해 주세요. 영업일 기준 순차
        답변합니다.
      </p>
      <p className="mt-6">
        <a
          href={`mailto:${env.CONTACT_EMAIL}`}
          className="inline-flex min-h-[48px] items-center rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-dark"
        >
          {env.CONTACT_EMAIL}
        </a>
      </p>
      <p className="mt-4 text-sm text-muted">
        긴급한 당첨금·세금 문의는{' '}
        <a
          href="https://www.dhlottery.co.kr/customer.do?method=customerMain"
          className="font-semibold text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          동행복권 고객센터
        </a>
        를 이용해 주세요.
      </p>
      <p className="mt-8 text-sm text-muted">
        <Link href="/disclaimer" className="text-brand underline">
          면책 조항
        </Link>
        ·{' '}
        <Link href="/privacy" className="text-brand underline">
          개인정보처리방침
        </Link>
      </p>
    </main>
  );
}
