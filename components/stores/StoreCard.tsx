import { formatDistanceKm } from '@/lib/core/geo/haversine';
import { kakaoMapSearchUrl, naverMapSearchUrl } from '@/lib/stores/map-links';
import type { StoreWithDistance } from '@/lib/stores/store-repository';

type Props = {
  store: StoreWithDistance;
  highlight?: boolean;
};

export function StoreCard({ store, highlight }: Props) {
  const lucky = store.firstPrizeCount > 0;

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
        highlight || lucky ? 'border-gold/50 ring-1 ring-gold/20' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold text-ink">
            {lucky && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                ⭐ 1등 {store.firstPrizeCount}회
              </span>
            )}
            {store.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{store.roadAddress}</p>
          {store.phone && (
            <a href={`tel:${store.phone.replace(/-/g, '')}`} className="mt-1 block text-sm text-brand">
              {store.phone}
            </a>
          )}
        </div>
        {store.distanceKm !== undefined && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink">
            {formatDistanceKm(store.distanceKm)}
          </span>
        )}
      </div>

      {(store.recentDraws?.length ?? store.firstPrizeDraws?.length ?? 0) > 0 && (
        <p className="mt-3 text-xs text-muted">
          최근 당첨 회차:{' '}
          {(store.recentDraws ?? store.firstPrizeDraws ?? []).slice(-5).join(', ')}회
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={naverMapSearchUrl(store.roadAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-ink hover:border-brand"
        >
          네이버 길찾기
        </a>
        <a
          href={kakaoMapSearchUrl(store.roadAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-ink hover:border-brand"
        >
          카카오맵
        </a>
      </div>
    </article>
  );
}
