import Link from 'next/link';

export function StatsUnavailable() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
      <p className="font-semibold text-amber-950">통계 데이터를 불러오지 못했습니다</p>
      <p className="mt-2 text-sm text-amber-900/90">
        동행복권 서버 연결이 불안정할 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-brand px-6 text-sm font-bold text-white"
      >
        홈으로
      </Link>
    </div>
  );
}
