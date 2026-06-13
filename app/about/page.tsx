import type { Metadata } from 'next';
import Link from 'next/link';
import { env } from '@/lib/utils/env';
import { isCoupangEnabled } from '@/lib/utils/ad-slots';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

export const metadata: Metadata = {
  title: '서비스 소개',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-ink">소개</h1>
      <p className="mt-4 leading-relaxed text-muted">
        <strong className="text-ink">{env.SITE_NAME}</strong>는 로또 6/45 당첨번호 확인, 세전·세후
        당첨금 계산, 사용 계획 시뮬레이션, 통계·번호 생성, 1등 명당 판매점 검색, 가이드
        콘텐츠를 한곳에서 제공하는 웹 서비스입니다.
      </p>
      <h2 className="mt-8 text-lg font-bold text-ink">주요 기능</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        <li>
          <Link href="/draw/latest" className="text-brand underline">
            최신 당첨번호
          </Link>{' '}
          및 회차별 상세
        </li>
        <li>
          <Link href="/calculator/tax" className="text-brand underline">
            세금·실수령액 계산기
          </Link>
        </li>
        <li>
          <Link href="/calculator/spending-plan" className="text-brand underline">
            사용 계획 시뮬레이터
          </Link>
        </li>
        <li>
          <Link href="/generator" className="text-brand underline">
            번호 생성기
          </Link>{' '}
          (통계 참고)
        </li>
        <li>
          <Link href="/stats" className="text-brand underline">
            통계
          </Link>
          ·{' '}
          <Link href="/stores" className="text-brand underline">
            판매점
          </Link>
        </li>
        <li>
          <Link href="/guide" className="text-brand underline">
            가이드
          </Link>
          ·{' '}
          <Link href="/lucky-items" className="text-brand underline">
            행운템
          </Link>
        </li>
      </ul>
      <h2 className="mt-8 text-lg font-bold text-ink">운영 정보</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>
          서비스 URL:{' '}
          <a href={env.SITE_URL} className="text-brand underline">
            {env.SITE_URL.replace(/^https?:\/\//, '')}
          </a>
        </li>
        {CONTACT_EMAIL ? (
          <li>
            문의:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
              {CONTACT_EMAIL}
            </a>
          </li>
        ) : (
          <li>
            문의:{' '}
            <Link href="/contact" className="text-brand underline">
              문의하기
            </Link>{' '}
            페이지 참고
          </li>
        )}
      </ul>

      <h2 className="mt-8 text-lg font-bold text-ink">수익·제휴 고지</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {env.SITE_NAME}는 무료로 정보·도구를 제공합니다. 일부 페이지에서는 Google AdSense
        디스플레이 광고, 행운템 코너에서는 쿠팡 파트너스 제휴 링크를 통해 수수료를 받을 수
        있습니다. 광고·제휴는 콘텐츠와 구분하여 표시하며, 당첨·세금 정보의 정확성과는
        무관합니다.
        {isCoupangEnabled() && (
          <>
            {' '}
            행운템 링크는 쿠팡 파트너스 활동으로, 링크를 통한 구매 시 수수료가 발생할 수
            있습니다.
          </>
        )}
      </p>

      <p className="mt-8 text-sm leading-relaxed text-muted">
        본 서비스는 <strong className="text-ink">동행복권과 무관</strong>한 비공식 정보 제공
        목적입니다. 당첨·세금·수령의 최종 확인은 공식 기관·전문가 상담을 따르세요.
      </p>
      <p className="mt-4 text-sm text-muted">
        <Link href="/contact" className="font-semibold text-brand underline">
          문의하기
        </Link>
      </p>
    </main>
  );
}
