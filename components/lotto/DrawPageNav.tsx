import Link from 'next/link';

type Props = {
  drwNo: number;
  latestNo: number | null;
};

export function DrawPageNav({ drwNo, latestNo }: Props) {
  const prev = drwNo > 1 ? drwNo - 1 : null;
  const next =
    latestNo !== null && drwNo < latestNo ? drwNo + 1 : null;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"
      aria-label="회차 이동"
    >
      {prev !== null ? (
        <Link
          href={`/draw/${prev}`}
          className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold text-ink hover:border-gold hover:bg-amber-50/50"
        >
          ← {prev}회
        </Link>
      ) : (
        <span className="text-sm text-muted">첫 회차</span>
      )}
      <Link
        href="/"
        className="text-sm font-semibold text-brand hover:underline"
      >
        홈
      </Link>
      {next !== null ? (
        <Link
          href={`/draw/${next}`}
          className="inline-flex min-h-[44px] items-center rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold text-ink hover:border-gold hover:bg-amber-50/50"
        >
          {next}회 →
        </Link>
      ) : (
        <span className="text-sm text-muted">최신 회차</span>
      )}
    </nav>
  );
}
