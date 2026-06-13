'use client';

import type { LottoStore } from '@/lib/types/store';

type Props = {
  stores: LottoStore[];
  center?: { lat: number; lng: number };
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

/** API 키 없이 OpenStreetMap 임베드 — 마커는 목록과 연동 */
export function StoreMap({ stores, center, selectedId, onSelect }: Props) {
  const lat = center?.lat ?? stores[0]?.lat ?? 36.5;
  const lng = center?.lng ?? stores[0]?.lng ?? 127.9;
  const delta = stores.length === 1 ? 0.02 : 0.08;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <iframe
          title="판매점 위치 지도"
          src={embedUrl}
          className="h-56 w-full sm:h-72"
          loading="lazy"
        />
      </div>
      {stores.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {stores.slice(0, 8).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect?.(s.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  selectedId === s.id
                    ? 'bg-brand text-white'
                    : 'bg-slate-100 text-ink hover:bg-slate-200'
                }`}
              >
                {s.firstPrizeCount > 0 ? '⭐ ' : ''}
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted">
        정확한 위치는 네이버·카카오 길찾기를 이용해 주세요. (© OpenStreetMap)
      </p>
    </div>
  );
}
