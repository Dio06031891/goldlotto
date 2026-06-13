export function LatestDrawSkeleton() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-10" aria-busy="true" aria-label="최신 회차 불러오는 중">
      <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-6 w-32 rounded bg-slate-200" />
        <div className="mt-4 h-10 w-64 rounded bg-slate-200" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-12 w-12 rounded-full bg-slate-200" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-slate-100" />
          <div className="h-20 rounded-xl bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
