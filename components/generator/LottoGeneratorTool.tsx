'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LottoBallSet } from '@/components/lotto/LottoBallSet';
import { GeneratorDisclaimer } from '@/components/generator/GeneratorDisclaimer';
import {
  LottoNumberPickBoard,
  LOTTO_PICK_MAX,
} from '@/components/generator/LottoNumberPickBoard';
import {
  generateLottoNumberSets,
  passesValidation,
  validateFixedNumbers,
} from '@/lib/core/generator/lotto-generator';
import { recordToWeights } from '@/lib/core/stats/frequency';
import type { FrequencyWeights } from '@/lib/core/stats/frequency';

type FreqApi = {
  drawCount: number;
  fromDrwNo: number | null;
  toDrwNo: number | null;
  weights: Record<string, number>;
  hot: number[];
};

function uniformWeights(): FrequencyWeights {
  const w = new Map<number, number>();
  for (let n = 1; n <= 45; n++) w.set(n, 1);
  return w;
}

function randomPick(count: number): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const out: number[] = [];
  while (out.length < count && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out.sort((a, b) => a - b);
}

export function LottoGeneratorTool() {
  const [picked, setPicked] = useState<number[]>([]);
  const [sets, setSets] = useState<number[][]>([]);
  const [manualSix, setManualSix] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<FrequencyWeights | null>(null);
  const [statsMeta, setStatsMeta] = useState<{
    drawCount: number;
    fromDrwNo: number | null;
    toDrwNo: number | null;
    hot: number[];
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsWarning, setStatsWarning] = useState<string | null>(null);

  const fixedCount = picked.length;
  const remain = 6 - fixedCount;

  const statusLabel = useMemo(() => {
    if (fixedCount === 0) return '번호를 고르지 않으면 6개 모두 통계 추천으로 채웁니다.';
    if (fixedCount < 6) return `고정 ${fixedCount}개 · 나머지 ${remain}개는 통계 추천으로 5세트 생성`;
    return '6개를 모두 선택했습니다. 아래가 직접 고른 한 게임입니다.';
  }, [fixedCount, remain]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/lotto/stats/frequency', { cache: 'no-store' });
        const body = (await res.json()) as FreqApi & { error?: string };
        if (!res.ok || !body.weights) {
          if (!cancelled) {
            setWeights(uniformWeights());
            setStatsWarning('통계 데이터를 불러오지 못해 기본 방식으로 생성합니다.');
          }
          return;
        }
        if (!cancelled) {
          setWeights(recordToWeights(body.weights));
          setStatsMeta({
            drawCount: body.drawCount,
            fromDrwNo: body.fromDrwNo,
            toDrwNo: body.toDrwNo,
            hot: body.hot ?? [],
          });
          setStatsWarning(null);
        }
      } catch {
        if (!cancelled) {
          setWeights(uniformWeights());
          setStatsWarning('통계 데이터를 불러오지 못해 기본 방식으로 생성합니다.');
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runGenerate = useCallback(
    (fixed: number[], excludePrevious?: number[][]) => {
      if (!weights) return;
      setError(null);
      setManualSix(false);

      if (fixed.length >= LOTTO_PICK_MAX) {
        const six = [...fixed].sort((a, b) => a - b).slice(0, LOTTO_PICK_MAX);
        setSets([six]);
        setManualSix(true);
        return;
      }

      try {
        validateFixedNumbers(fixed);
        const next = generateLottoNumberSets({
          fixedNumbers: fixed,
          count: 5,
          useStatistics: true,
          frequencyWeights: weights,
          excludeSets: excludePrevious,
        });
        setSets(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : '번호 생성에 실패했습니다.');
        setSets([]);
      }
    },
    [weights]
  );

  const onGenerate = () => {
    if (!weights) return;
    runGenerate([...picked].sort((a, b) => a - b));
  };

  const onRegenerate = () => {
    if (!weights) return;
    runGenerate([...picked].sort((a, b) => a - b), manualSix ? undefined : sets);
  };

  const clearAll = () => {
    setPicked([]);
    setSets([]);
    setManualSix(false);
    setError(null);
  };

  const autoFillSix = () => {
    setError(null);
    let nums = randomPick(6);
    for (let i = 0; i < 30 && !passesValidation(nums); i++) {
      nums = randomPick(6);
    }
    setPicked(nums);
    setSets([]);
    setManualSix(false);
  };

  const hasResults = sets.length > 0;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-ink">
        {statsLoading ? (
          <p>최근 당첨 통계를 불러오는 중…</p>
        ) : statsMeta ? (
          <>
            <p className="font-semibold">통계 추천 + 직접 선택</p>
            <p className="mt-1 text-muted">
              동행복권처럼 번호를 고른 뒤, 남는 칸은 최근 {statsMeta.drawCount}회차 통계로
              채운 <strong className="text-ink">5세트</strong>를 추천합니다. 누를 때마다 조합이
              바뀝니다.
            </p>
          </>
        ) : null}
        {statsWarning && (
          <p className="mt-2 text-xs font-medium text-amber-800">{statsWarning}</p>
        )}
      </div>

      <section className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <LottoNumberPickBoard
          selected={picked}
          onChange={(nums) => {
            setPicked(nums);
            setSets([]);
            setManualSix(false);
            setError(null);
          }}
          disabled={statsLoading}
        />

        <p className="mt-4 text-center text-sm text-muted">{statusLabel}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={clearAll}
            disabled={statsLoading}
            className="min-h-[44px] rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold text-ink hover:bg-slate-50"
          >
            전체 해제
          </button>
          <button
            type="button"
            onClick={autoFillSix}
            disabled={statsLoading}
            className="min-h-[44px] rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold text-ink hover:bg-slate-50"
          >
            자동 6개 채우기
          </button>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={statsLoading || !weights}
          className="min-h-[48px] flex-1 rounded-full bg-brand px-6 font-bold text-white shadow-md hover:bg-brand-dark disabled:opacity-50 sm:flex-none sm:px-8"
        >
          {fixedCount >= 6
            ? '선택 번호 확인'
            : hasResults
              ? '다시 추천 (5세트)'
              : fixedCount === 0
                ? '통계 추천 5세트'
                : `고정 ${fixedCount}개 · 추천 5세트`}
        </button>
        {hasResults && fixedCount < 6 && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={statsLoading || !weights}
            className="min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-6 font-semibold text-ink hover:bg-slate-50 disabled:opacity-50"
          >
            같은 조건 재생성
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {hasResults && (
        <ol className="space-y-4">
          {sets.map((nums, idx) => (
            <li
              key={`${idx}-${nums.join('-')}`}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5"
            >
              <p className="mb-3 text-sm font-bold text-ink">
                {manualSix ? '내가 고른 번호 (6/6)' : `추천 세트 ${idx + 1}`}
                {!manualSix && weights && statsMeta && (
                  <span className="ml-2 text-xs font-normal text-muted">
                    통계 점수 {nums.reduce((s, n) => s + (weights.get(n) ?? 1), 0)}
                  </span>
                )}
              </p>
              <LottoBallSet numbers={nums} size="md" />
            </li>
          ))}
        </ol>
      )}

      {fixedCount >= 6 && hasResults && (
        <p className="text-center text-sm text-muted">
          5세트 추천을 받으려면 번호를 하나 지운 뒤 다시 생성해 주세요.
        </p>
      )}

      <GeneratorDisclaimer />
    </div>
  );
}
