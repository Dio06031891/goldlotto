'use client';

import { useCallback, useMemo, useState } from 'react';
import { StoreCard } from '@/components/stores/StoreCard';
import { StoreMap } from '@/components/stores/StoreMap';
import type { LottoStore } from '@/lib/types/store';

type Props = {
  initialStores: LottoStore[];
  initialCenter?: { lat: number; lng: number };
};

const RADIUS_OPTIONS = [1, 3, 5] as const;

export function StoreFinder({ initialStores, initialCenter }: Props) {
  const [query, setQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState<(typeof RADIUS_OPTIONS)[number]>(3);
  const [stores, setStores] = useState(initialStores);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    initialCenter ?? null
  );
  const [selectedId, setSelectedId] = useState<string | null>(initialStores[0]?.id ?? null);

  const selected = useMemo(
    () => stores.find((s) => s.id === selectedId) ?? stores[0],
    [stores, selectedId]
  );

  const mapCenter = userPos ?? (selected ? { lat: selected.lat, lng: selected.lng } : undefined);

  const fetchStores = useCallback(
    async (opts: { q?: string; lat?: number; lng?: number; radius?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (opts.q) params.set('q', opts.q);
        if (opts.lat !== undefined && opts.lng !== undefined) {
          params.set('lat', String(opts.lat));
          params.set('lng', String(opts.lng));
          params.set('radiusKm', String(opts.radius ?? radiusKm));
        }
        params.set('luckOnly', '1');
        params.set('limit', '50');
        const res = await fetch(`/api/stores?${params.toString()}`);
        const body = (await res.json()) as { stores?: LottoStore[]; error?: string };
        if (!res.ok) throw new Error(body.error ?? '검색 실패');
        setStores(body.stores ?? []);
        if (body.stores?.[0]) setSelectedId(body.stores[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : '검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [radiusKm]
  );

  const onSearch = () => {
    void fetchStores({ q: query.trim() || undefined, lat: userPos?.lat, lng: userPos?.lng });
  };

  const onNearMe = () => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos({ lat, lng });
        void fetchStores({ lat, lng, radius: radiusKm });
      },
      () => {
        setError('위치 권한이 필요합니다. 설정에서 허용해 주세요.');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 12_000 }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder="상호·주소·지역 검색"
          className="min-h-[48px] flex-1 rounded-xl border-2 border-slate-200 px-4 text-base"
          aria-label="판매점 검색"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={loading}
          className="min-h-[48px] rounded-xl bg-brand px-6 font-bold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          검색
        </button>
        <button
          type="button"
          onClick={onNearMe}
          disabled={loading}
          className="min-h-[48px] rounded-xl border-2 border-slate-200 px-5 font-semibold text-ink hover:border-gold disabled:opacity-50"
        >
          내 주변
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted">반경</span>
        {RADIUS_OPTIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRadiusKm(r);
              if (userPos) void fetchStores({ lat: userPos.lat, lng: userPos.lng, radius: r });
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              radiusKm === r ? 'bg-ink text-white' : 'bg-slate-100 text-muted'
            }`}
          >
            {r}km
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      <StoreMap
        stores={stores}
        center={mapCenter}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <p className="text-sm text-muted">
        {loading ? '검색 중…' : `${stores.length}곳 (1등 배출 명당 데이터)`}
      </p>

      <ul className="space-y-4">
        {stores.map((store) => (
          <li key={store.id}>
            <div onClick={() => setSelectedId(store.id)} className="cursor-pointer">
              <StoreCard store={store} highlight={store.id === selectedId} />
            </div>
          </li>
        ))}
      </ul>

      {stores.length === 0 && !loading && (
        <p className="text-center text-sm text-muted">조건에 맞는 판매점이 없습니다.</p>
      )}

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-muted">
        전국 모든 로또 판매점은{' '}
        <a
          href="https://www.dhlottery.co.kr/wnprchsplcsrch/home"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand underline"
        >
          동행복권 판매점 찾기
        </a>
        에서도 확인할 수 있습니다.
      </p>
    </div>
  );
}
