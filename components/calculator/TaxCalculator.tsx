'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { afterTax, calcTax, PRIZE_PRESETS } from '@/lib/core/tax/calculator';
import { formatKoreanAmount, formatKRW } from '@/lib/core/format/currency';
import type {
  DhLotteryDrawJson,
  LottoEpisodeSchedule,
  LottoRank,
} from '@/lib/lotto/dhlottery-types';
import { parseDhLotteryDraw, prizeForRank } from '@/lib/lotto/dhlottery-types';

const PRESETS: { label: string; value: number }[] = [
  { label: '5등 (5천원)', value: PRIZE_PRESETS.rank5 },
  { label: '4등 (5만원)', value: PRIZE_PRESETS.rank4 },
  { label: '3등 (150만)', value: PRIZE_PRESETS.rank3 },
  { label: '2등 (5천만)', value: PRIZE_PRESETS.rank2 },
  { label: '1등 평균 (18억)', value: PRIZE_PRESETS.rank1Average },
  { label: '1등 이월 (25억)', value: PRIZE_PRESETS.rank1High },
];

type InputMode = 'manual' | 'draw';

const RANKS: { rank: LottoRank; label: string }[] = [
  { rank: 1, label: '1등 (1인당)' },
  { rank: 2, label: '2등 (1인당)' },
  { rank: 3, label: '3등' },
  { rank: 4, label: '4등' },
  { rank: 5, label: '5등' },
];

function formatYmdKorean(ymd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return ymd;
  const [, y, mo, da] = m;
  return `${y}년 ${parseInt(mo, 10)}월 ${parseInt(da, 10)}일`;
}

function isSaturdayYmd(ymd: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return false;
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const d = parseInt(m[3], 10);
  const dt = new Date(y, mo, d);
  return dt.getDay() === 6;
}

function dhGameResultUrl(drwNo: number): string {
  return `https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${drwNo}`;
}

export function TaxCalculator() {
  const [mode, setMode] = useState<InputMode>('draw');
  const [digits, setDigits] = useState('');
  const [drawNoInput, setDrawNoInput] = useState('');
  const [latestDraw, setLatestDraw] = useState<DhLotteryDrawJson | null>(null);
  const [drawData, setDrawData] = useState<DhLotteryDrawJson | null>(null);
  const [rank, setRank] = useState<LottoRank>(1);
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [latestLoading, setLatestLoading] = useState(true);
  const [latestError, setLatestError] = useState<string | null>(null);
  const [scheduleEpisodes, setScheduleEpisodes] = useState<LottoEpisodeSchedule[] | null>(
    null
  );
  const [scheduleLoadState, setScheduleLoadState] = useState<'idle' | 'loading' | 'error'>(
    'idle'
  );
  const [weekPickDate, setWeekPickDate] = useState('');
  const [showLatestAmounts, setShowLatestAmounts] = useState(false);
  const latestAmountsRef = useRef<HTMLDivElement>(null);

  const prizeFromManual = useMemo(() => {
    const n = parseInt(digits, 10);
    return Number.isFinite(n) ? n : 0;
  }, [digits]);

  const prizeFromDraw = useMemo(() => {
    if (!drawData) return 0;
    return prizeForRank(drawData, rank);
  }, [drawData, rank]);

  const prize = mode === 'manual' ? prizeFromManual : prizeFromDraw;
  const tax = prize > 0 ? calcTax(prize) : 0;
  const net = prize > 0 ? afterTax(prize) : 0;

  const saturdayDrawOptions = useMemo(() => {
    if (!scheduleEpisodes?.length) return [];
    return [...scheduleEpisodes]
      .filter((e) => isSaturdayYmd(e.drwNoDate))
      .reverse();
  }, [scheduleEpisodes]);

  const calendarMatch = useMemo(() => {
    if (!weekPickDate || !scheduleEpisodes?.length) return null;
    return scheduleEpisodes.find((e) => e.drwNoDate === weekPickDate) ?? null;
  }, [weekPickDate, scheduleEpisodes]);

  function onInputChange(raw: string) {
    const only = raw.replace(/\D/g, '').slice(0, 12);
    setDigits(only);
  }

  const loadLatestDraw = useCallback(async () => {
    setLatestLoading(true);
    setLatestError(null);
    try {
      const res = await fetch('/api/lotto/latest', { cache: 'no-store' });
      const body = (await res.json()) as unknown;

      if (!res.ok) {
        const err =
          body && typeof body === 'object' && 'error' in body
            ? String((body as { error: string }).error)
            : 'UNKNOWN';
        if (err === 'DRAW_NOT_FOUND') {
          setLatestError('최신 회차 정보를 찾을 수 없습니다.');
        } else {
          setLatestError('최신 회차를 불러오지 못했습니다. 아래에서 회차를 지정해 보세요.');
        }
        return;
      }
      const normalized = parseDhLotteryDraw(body);
      if (!normalized) {
        setLatestError('최신 회차 응답을 해석할 수 없습니다.');
        return;
      }
      setLatestDraw(normalized);
      setDrawData(normalized);
      setDrawNoInput(String(normalized.drwNo));
      setDrawError(null);
    } catch {
      setLatestError('네트워크 오류로 최신 회차를 불러오지 못했습니다.');
    } finally {
      setLatestLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLatestDraw();
  }, [loadLatestDraw]);

  useEffect(() => {
    if (mode !== 'draw') return;
    let cancelled = false;
    setScheduleLoadState('loading');
    void (async () => {
      try {
        const res = await fetch('/api/lotto/schedule', { cache: 'no-store' });
        const body = (await res.json()) as { episodes?: LottoEpisodeSchedule[] };
        if (cancelled) return;
        if (!res.ok || !body.episodes?.length) {
          setScheduleEpisodes(null);
          setScheduleLoadState('error');
          return;
        }
        setScheduleEpisodes(body.episodes);
        setScheduleLoadState('idle');
      } catch {
        if (!cancelled) {
          setScheduleEpisodes(null);
          setScheduleLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const fetchDrawByEpisode = useCallback(async (n: number) => {
    if (!Number.isFinite(n) || n < 1) {
      setDrawError('회차 번호가 올바르지 않습니다.');
      return;
    }
    setDrawLoading(true);
    setDrawError(null);
    try {
      const res = await fetch(`/api/lotto/${n}`, { cache: 'no-store' });
      const body = (await res.json()) as unknown;

      if (!res.ok) {
        const err =
          body && typeof body === 'object' && 'error' in body
            ? String((body as { error: string }).error)
            : 'UNKNOWN';
        if (err === 'DRAW_NOT_FOUND') {
          setDrawError('해당 회차 데이터가 없거나 아직 발표되지 않았습니다.');
        } else {
          setDrawError('당첨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
        return;
      }
      const normalized = parseDhLotteryDraw(body);
      if (!normalized) {
        setDrawError('응답 형식을 해석할 수 없습니다.');
        return;
      }
      setDrawData(normalized);
      setDrawNoInput(String(normalized.drwNo));
    } catch {
      setDrawError('네트워크 오류가 발생했습니다.');
    } finally {
      setDrawLoading(false);
    }
  }, []);

  const loadDrawFromInput = useCallback(() => {
    const n = parseInt(drawNoInput.replace(/\D/g, ''), 10);
    if (!Number.isFinite(n) || n < 1) {
      setDrawError('회차 번호를 입력해 주세요.');
      return;
    }
    void fetchDrawByEpisode(n);
  }, [drawNoInput, fetchDrawByEpisode]);

  const toggleLatestAmounts = useCallback(() => {
    setShowLatestAmounts((prev) => {
      const next = !prev;
      if (next) {
        queueMicrotask(() => {
          latestAmountsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        });
      }
      return next;
    });
  }, []);

  return (
    <div className="mt-8 space-y-8">
      <div
        className="flex rounded-xl border border-slate-200 bg-slate-100/80 p-1"
        role="tablist"
        aria-label="입력 방식"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'draw'}
          className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold transition ${
            mode === 'draw'
              ? 'bg-white text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
          onClick={() => setMode('draw')}
        >
          회차·등수
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'manual'}
          className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold transition ${
            mode === 'manual'
              ? 'bg-white text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
          onClick={() => setMode('manual')}
        >
          금액 직접 입력
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-6">
          {latestError && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {latestError}
            </p>
          )}

          {latestLoading && !drawData ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center text-sm font-medium text-muted">
              최신 회차 정보를 불러오는 중…
            </div>
          ) : drawData ? (
            <>
              {latestDraw && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={toggleLatestAmounts}
                    className="flex w-full flex-col gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm outline-none ring-brand/0 transition hover:border-brand/40 hover:ring-4 hover:ring-brand/10 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15"
                    aria-controls="latest-draw-prize-amounts"
                    aria-expanded={showLatestAmounts}
                  >
                    <span className="font-semibold text-ink">최신 추첨</span>
                    <span className="text-ink">
                      <span className="font-bold">제{latestDraw.drwNo}회</span>
                      <span className="mx-2 text-muted">·</span>
                      <span className="text-muted">
                        {formatYmdKorean(latestDraw.drwNoDate)}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-brand">
                      {showLatestAmounts
                        ? '당첨금 접기'
                        : '1~5등 당첨금 보기 (탭하여 펼치기)'}
                    </span>
                  </button>

                  {showLatestAmounts && (
                    <div
                      id="latest-draw-prize-amounts"
                      ref={latestAmountsRef}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-muted">
                        동행복권 공개 1인당 당첨금 (세전)
                      </p>
                      <dl className="mt-3 space-y-2 text-sm">
                        {RANKS.map(({ rank: r, label }) => (
                          <div
                            key={r}
                            className="flex justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0"
                          >
                            <dt className="text-muted">{label}</dt>
                            <dd className="font-semibold tabular-nums text-ink">
                              {formatKRW(prizeForRank(latestDraw, r))}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <a
                        href={dhGameResultUrl(latestDraw.drwNo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand bg-white px-4 text-center text-sm font-bold text-brand transition hover:bg-brand/5"
                      >
                        동행복권 당첨결과 페이지로 이동
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-amber-50/90 to-white px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {latestDraw && drawData.drwNo === latestDraw.drwNo
                    ? '당첨금 계산 (최신 회차 · 동행복권 공개 1인당)'
                    : '당첨금 계산 회차 (동행복권 공개 1인당)'}
                </p>
                <p className="mt-2 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  제{drawData.drwNo}회{' '}
                  <span className="font-bold text-muted">·</span>{' '}
                  <span className="text-lg font-bold sm:text-xl">
                    {formatYmdKorean(drawData.drwNoDate)} 추첨
                  </span>
                </p>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">
                  등수 선택
                </legend>
                <div className="flex flex-wrap gap-2">
                  {RANKS.map(({ rank: r, label }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRank(r)}
                      className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        rank === r
                          ? 'border-gold bg-amber-50 text-ink ring-2 ring-gold/40'
                          : 'border-slate-200 bg-white text-ink hover:border-gold/80'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <p className="text-sm text-muted">
                선택한 등수 당첨금(세전):{' '}
                <strong className="tabular-nums text-ink">
                  {prizeFromDraw > 0 ? formatKRW(prizeFromDraw) : '—'}
                </strong>
              </p>
            </>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-5">
            <h2 className="text-sm font-bold text-ink">다른 회차 불러오기</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              <strong className="text-ink">추첨일</strong> 목록에서 날짜를 고르면 회차와
              함께 확인한 뒤 불러올 수 있습니다.
            </p>

            {scheduleLoadState === 'loading' && (
              <p className="mt-3 text-sm text-muted">회차·날짜 목록을 불러오는 중…</p>
            )}
            {scheduleLoadState === 'error' && (
              <p className="mt-3 text-sm text-amber-800">
                회차·날짜 목록을 불러오지 못했습니다. 아래「회차 번호로 입력」으로 불러올 수
                있습니다.
              </p>
            )}

            {scheduleEpisodes && saturdayDrawOptions.length > 0 && (
              <div className="mt-4 space-y-3">
                <label
                  htmlFor="draw-date-pick"
                  className="block text-sm font-semibold text-ink"
                >
                  추첨일 선택
                </label>
                <select
                  id="draw-date-pick"
                  value={weekPickDate}
                  onChange={(e) => setWeekPickDate(e.target.value)}
                  className="min-h-[48px] w-full max-w-md rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-base font-medium text-ink shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
                >
                  <option value="">추첨일을 선택하세요</option>
                  {saturdayDrawOptions.map((e) => (
                    <option key={e.drwNo} value={e.drwNoDate}>
                      {formatYmdKorean(e.drwNoDate)} (토) — 제{e.drwNo}회
                    </option>
                  ))}
                </select>
                {weekPickDate ? (
                  <p className="text-sm text-ink">
                    {calendarMatch ? (
                      <>
                        선택한 추첨일:{' '}
                        <strong className="tabular-nums">제{calendarMatch.drwNo}회</strong>
                        <span className="mx-1.5 text-muted">·</span>
                        <span className="text-muted">
                          {formatYmdKorean(calendarMatch.drwNoDate)} 추첨
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-800">
                        추첨일을 선택하면 해당 회차가 표시됩니다.
                      </span>
                    )}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => calendarMatch && void fetchDrawByEpisode(calendarMatch.drwNo)}
                  disabled={drawLoading || !calendarMatch}
                  className="min-h-[48px] w-full max-w-sm rounded-xl bg-brand px-6 font-bold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-50 sm:w-auto"
                >
                  {drawLoading ? '불러오는 중…' : '이 회차 불러오기'}
                </button>
              </div>
            )}

            {scheduleEpisodes &&
              scheduleEpisodes.length > 0 &&
              saturdayDrawOptions.length === 0 && (
                <p className="mt-3 text-sm text-amber-800">
                  공개 데이터에 표시할 추첨일(토요일)이 없어 목록을 만들 수 없습니다. 아래「회차
                  번호로 입력」을 이용해 주세요.
                </p>
              )}

            <details className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-ink">
                회차 번호로 입력
              </summary>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <input
                  id="draw-no"
                  type="text"
                  inputMode="numeric"
                  aria-label="회차 번호"
                  placeholder="예: 1199"
                  value={drawNoInput}
                  onChange={(e) =>
                    setDrawNoInput(e.target.value.replace(/\D/g, '').slice(0, 5))
                  }
                  className="min-h-[48px] w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg font-medium text-ink shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15 sm:max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => void loadDrawFromInput()}
                  disabled={drawLoading}
                  className="min-h-[48px] shrink-0 rounded-xl border-2 border-slate-300 bg-slate-50 px-6 font-bold text-ink shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {drawLoading ? '불러오는 중…' : '불러오기'}
                </button>
              </div>
            </details>

            {drawError && (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {drawError}
              </p>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted">
            회차별 금액은 동행복권 lt645 JSON API를 서버에서 조회합니다. 다른 회차는
            <strong className="font-medium text-ink"> 추첨일(토요일)</strong>만 선택할 수
            있습니다. 일시적 오류 시 회차 번호 입력 또는 금액 직접 입력 탭을 이용해 주세요.
            실제 수령액은 세무 처리에 따라 달라질 수 있습니다.
          </p>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor="prize-input"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              당첨금 (원)
            </label>
            <input
              id="prize-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="숫자만 입력 (예: 1800000000)"
              value={digits ? Number(digits).toLocaleString('ko-KR') : ''}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-lg font-medium text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setDigits(String(p.value))}
                className="min-h-[44px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-gold hover:bg-amber-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}

      {prize > 0 && (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg">
          <dl className="space-y-4 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">당첨금 (세전)</dt>
              <dd className="font-semibold tabular-nums text-ink">
                {formatKRW(prize)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-red-600">
              <dt>세금</dt>
              <dd className="font-semibold tabular-nums">
                − {formatKRW(tax)}
              </dd>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between gap-4 text-lg">
                <dt className="font-bold text-ink">실수령액 (세후)</dt>
                <dd className="bg-gradient-to-r from-gold to-gold-bright bg-clip-text font-extrabold tabular-nums text-transparent">
                  {formatKRW(net)}
                </dd>
              </div>
              <p className="mt-3 text-center text-sm text-muted">
                약{' '}
                <strong className="text-ink">{formatKoreanAmount(net)}</strong>
              </p>
            </div>
          </dl>
          <Link
            href={`/calculator/spending-plan?net=${net}`}
            className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-gold/50 bg-amber-50 px-4 text-center text-sm font-bold text-ink transition hover:bg-amber-100"
          >
            이 실수령액으로 사용 계획 짜기 →
          </Link>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted">
        ※ 200만원 이하 비과세, 3억 이하 22%, 3억 초과 33% 적용 (2025~2026년 기준). 복권
        1,000원은 당첨금에서 차감 후 과세합니다. 실제 수령액은 세무 처리에 따라 달라질 수
        있습니다.
      </p>
    </div>
  );
}
