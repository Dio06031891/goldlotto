type Props = {
  /** 통계 페이지 상단 — 데이터 출처 + 확률 고지 */
  showDataSource?: boolean;
};

export function StatsDisclaimer({ showDataSource = true }: Props) {
  return (
    <div className="space-y-3">
      {showDataSource && (
        <p className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-xs leading-relaxed text-slate-800">
          아래 숫자는 <strong>동행복권 공식 당첨번호</strong>를 모아 집계한{' '}
          <strong>과거 사실(팩트)</strong>입니다. 당첨번호는 공식 홈페이지 기준으로 약 1시간마다
          갱신됩니다. 명당·판매점 1등 횟수는 주 1회 업데이트됩니다.
        </p>
      )}
      <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
        다만 과거에 자주 나온 번호가 앞으로도 잘 나온다는 뜻은 <strong>아닙니다</strong>.
        모든 번호의 당첨 확률은 매 회차 동일합니다. 아래 통계는{' '}
        <strong>참고·재미용</strong>으로만 봐 주세요.
      </p>
    </div>
  );
}
