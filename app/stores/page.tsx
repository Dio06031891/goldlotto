import type { Metadata } from 'next';
import Link from 'next/link';
import { StoresClient } from '@/components/stores/StoresClient';
import { AdSenseSlot } from '@/components/ads/AdSenseSlot';
import { SIDO_LIST } from '@/lib/stores/korea-regions';
import { getLuckStoresMeta } from '@/lib/stores/luck-stores-data';
import { getTopLuckStores } from '@/lib/stores/store-repository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '로또 판매점 찾기 | 1등 명당 지도·내 주변 검색',
  description:
    '전국 로또 6/45 1등 배출 판매점(명당)을 지도·목록으로 검색합니다. 내 주변 1·3·5km, 지역별 보기.',
  alternates: { canonical: '/stores' },
};

export default function StoresPage() {
  const initial = getTopLuckStores(50);
  const meta = getLuckStoresMeta();
  const totalStores = meta?.storeCount;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        로또 판매점 찾기
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        1등 당첨 이력이 있는 <strong className="text-ink">명당</strong>을 검색하고, 네이버·카카오
        지도로 길찾기할 수 있습니다.
      </p>
      {meta ? (
        <p className="mt-2 text-sm text-muted">
          {totalStores ? (
            <>
              전국 1등 배출 명당{' '}
              <strong className="text-ink">{totalStores.toLocaleString('ko-KR')}곳</strong>
              {meta.toDrwNo ? ` · ${meta.toDrwNo}회까지 반영` : ''}. 1등 배출 횟수는{' '}
            </>
          ) : (
            <>1등 배출 횟수는{' '}</>
          )}
          <a
            href="https://www.dhlottery.co.kr/gameResult.do?method=byWin"
            className="font-medium text-ink underline decoration-gold/60"
            rel="noopener noreferrer"
            target="_blank"
          >
            동행복권 당첨판매점
          </a>{' '}
          공식 발표를 참고해 집계했습니다. 과거 실적이 미래 당첨을 보장하지 않습니다.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">
          명당 데이터를 불러오는 중이거나 아직 동기화되지 않았습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/stores/top-luck-spots"
          className="min-h-[40px] rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-200"
        >
          ⭐ 1등 명당 TOP
        </Link>
        {SIDO_LIST.slice(0, 6).map((s) => (
          <Link
            key={s.slug}
            href={`/stores/region/${s.slug}`}
            className="min-h-[40px] rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink hover:border-gold"
          >
            {s.shortName}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <StoresClient initialStores={initial} totalStores={totalStores} />
      </div>

      <AdSenseSlot slot="stores" />
    </main>
  );
}
