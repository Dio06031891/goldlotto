import type { Metadata } from 'next';
import { env } from '@/lib/utils/env';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-muted">
      <h1 className="text-2xl font-bold text-ink">개인정보처리방침</h1>
      <p className="mt-4">시행일: 2026년 6월 1일 · {env.SITE_NAME}</p>

      <h2 className="mt-8 text-lg font-bold text-ink">1. 수집하는 개인정보</h2>
      <p className="mt-2">
        본 서비스는 회원가입을 운영하지 않으며, 서버에 이름·연락처·주민번호 등을 저장하지
        않습니다. 다만 서비스 이용 과정에서 아래 정보가 자동으로 생성·수집될 수 있습니다.
      </p>
      <ul className="mt-2 list-disc pl-5">
        <li>접속 로그, IP, 브라우저 종류, 쿠키(분석·광고 도구 연동 시)</li>
        <li>기기의 위치 정보(판매점 「내 주변」 기능 이용 시, 사용자 동의 하에 브라우저에서만 사용)</li>
      </ul>

      <h2 className="mt-8 text-lg font-bold text-ink">2. 브라우저 저장(IndexedDB)</h2>
      <p className="mt-2">
        사용 계획 시뮬레이터 등 일부 기능은 <strong className="text-ink">사용자 기기의
        IndexedDB</strong>에만 데이터를 저장합니다. 이 정보는 운영자 서버·Firestore로 전송되지
        않습니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">3. 제3자 제공·광고·분석</h2>
      <p className="mt-2">
        서비스 품질·수익화를 위해 아래 제3자 서비스를 사용할 수 있습니다. 연동 여부는 운영
        환경 설정에 따릅니다.
      </p>
      <ul className="mt-2 list-disc pl-5">
        <li>
          <strong className="text-ink">Google Analytics</strong> — 방문 통계 (쿠키 사용)
        </li>
        <li>
          <strong className="text-ink">Google AdSense</strong> — 맞춤·비맞춤 광고 게재를 위해
          쿠키를 사용할 수 있습니다. Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-brand underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 정책
          </a>
          을 참고하세요. 맞춤 광고를 원하지 않으면{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-brand underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>
          에서 관리할 수 있습니다.
        </li>
        <li>
          <strong className="text-ink">쿠팡 파트너스</strong> — 행운템 링크 클릭·구매 추적
        </li>
      </ul>

      <h2 className="mt-8 text-lg font-bold text-ink">4. 쿠키 거부</h2>
      <p className="mt-2">
        브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 일부 기능(분석·광고
        표시)이 제한될 수 있습니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">5. 이용자 권리</h2>
      <p className="mt-2">
        브라우저에서 IndexedDB·쿠키를 삭제하면 로컬 저장 데이터를 지울 수 있습니다. 문의는{' '}
        <a href="/contact" className="text-brand underline">
          문의하기
        </a>
        를 이용해 주세요.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">6. 방침 변경</h2>
      <p className="mt-2">법령·서비스 변경 시 본 페이지를 통해 공지할 수 있습니다.</p>
    </main>
  );
}
