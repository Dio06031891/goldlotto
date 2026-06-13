import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '면책 조항',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-muted">
      <h1 className="text-2xl font-bold text-ink">면책 조항</h1>

      <p className="mt-4">
        본 사이트(황금로또)는 로또 6/45 관련 정보를 <strong className="text-ink">참고용</strong>
        으로 제공합니다. 동행복권·정부 기관의 공식 발표와 다를 수 있으며, 최종 확인은{' '}
        <a
          href="https://www.dhlottery.co.kr"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          동행복권
        </a>
        및 관할 기관 안내를 따르세요.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">세금·수령</h2>
      <p className="mt-2">
        세금 계산기·가이드는 일반적인 계산 예시이며 세무·법률 자문이 아닙니다. 실제 세액·수령
        절차는 개인 상황·시점에 따라 달라질 수 있습니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">통계·번호 생성</h2>
      <p className="mt-2">
        과거 당첨 데이터·통계·번호 생성 결과는 <strong className="text-ink">당첨을 보장하지
        않습니다.</strong> 모든 번호 조합의 당첨 확률은 수학적으로 동일합니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">판매점·행운템</h2>
      <p className="mt-2">
        1등 명당·판매점 정보는 공개 자료·시드 데이터 기준이며 누락·오류가 있을 수 있습니다.
        행운템 링크는 쿠팡 파트너스 등 제휴가 포함될 수 있으며, 구매는 이용자 책임입니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-ink">책임의 한계</h2>
      <p className="mt-2">
        운영자는 서비스 이용으로 발생한 직·간접 손해에 대해 법령이 허용하는 범위를 넘어
        책임지지 않습니다. 복권은 적정 선에서 이용하시고, 문제가 있으면 전문 상담 기관을
        이용하세요.
      </p>
    </main>
  );
}
