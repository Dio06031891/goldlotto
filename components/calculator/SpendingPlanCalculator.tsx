'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpendingPlanChart } from '@/components/calculator/SpendingPlanChart';
import { SpendingPlanShare } from '@/components/calculator/SpendingPlanShare';
import {
  CATEGORY_META,
  SINGLE_CATEGORIES,
  type SingleSpendingCategory,
} from '@/lib/core/spending/categories';
import { amountForCategory, chartSegments, planTotals, wishlistItems } from '@/lib/core/spending/plan-math';
import { formatKoreanAmount, formatKRW, parseKRW } from '@/lib/core/format/currency';
import { usePlanStore } from '@/lib/store/plan-store';

function MoneyInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (amount: number) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value > 0 ? value.toLocaleString('ko-KR') : '');

  useEffect(() => {
    setText(value > 0 ? value.toLocaleString('ko-KR') : '');
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder ?? '0'}
        value={text}
        onChange={(e) => {
          const next = parseKRW(e.target.value);
          setText(e.target.value.replace(/[^\d,]/g, ''));
          onChange(next);
        }}
        onBlur={() => {
          setText(value > 0 ? value.toLocaleString('ko-KR') : '');
        }}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium tabular-nums text-ink shadow-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
      />
    </div>
  );
}

export function SpendingPlanCalculator() {
  const searchParams = useSearchParams();
  const appliedNetRef = useRef(false);

  const hydrated = usePlanStore((s) => s.hydrated);
  const currentPlan = usePlanStore((s) => s.currentPlan);
  const plans = usePlanStore((s) => s.plans);
  const loadPlans = usePlanStore((s) => s.loadPlans);
  const createPlan = usePlanStore((s) => s.createPlan);
  const setCurrentPlan = usePlanStore((s) => s.setCurrentPlan);
  const renameCurrentPlan = usePlanStore((s) => s.renameCurrentPlan);
  const deletePlan = usePlanStore((s) => s.deletePlan);
  const setTotalAmount = usePlanStore((s) => s.setTotalAmount);
  const setCategoryAmount = usePlanStore((s) => s.setCategoryAmount);
  const addWishlistItem = usePlanStore((s) => s.addWishlistItem);
  const updateItem = usePlanStore((s) => s.updateItem);
  const removeItem = usePlanStore((s) => s.removeItem);

  const [wishName, setWishName] = useState('');
  const [wishAmount, setWishAmount] = useState('');
  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [newPlanTotal, setNewPlanTotal] = useState(0);
  const [bootstrapTotal, setBootstrapTotal] = useState(0);
  const [planNameDraft, setPlanNameDraft] = useState('');

  const totals = useMemo(
    () => (currentPlan ? planTotals(currentPlan) : { spent: 0, remaining: 0, isOverBudget: false }),
    [currentPlan]
  );

  const segments = useMemo(
    () => (currentPlan ? chartSegments(currentPlan) : []),
    [currentPlan]
  );

  const applyNetFromQuery = useCallback(async () => {
    const raw = searchParams.get('net');
    const net = raw ? parseInt(raw.replace(/\D/g, ''), 10) : 0;
    if (!Number.isFinite(net) || net <= 0 || appliedNetRef.current) return;
    appliedNetRef.current = true;

    const state = usePlanStore.getState();
    if (!state.currentPlan) {
      await state.createPlan(net, '세후 당첨금');
      return;
    }
    if (state.plans.length === 1 && state.currentPlan.totalAmount === 0) {
      await state.setTotalAmount(net);
    }
  }, [searchParams]);

  useEffect(() => {
    void loadPlans().then(() => applyNetFromQuery());
  }, [loadPlans, applyNetFromQuery]);

  useEffect(() => {
    if (currentPlan) setPlanNameDraft(currentPlan.name);
  }, [currentPlan]);

  const handleNewPlan = async () => {
    if (newPlanTotal <= 0) return;
    await createPlan(newPlanTotal);
    setNewPlanOpen(false);
    setNewPlanTotal(0);
  };

  if (!hydrated) {
    return (
      <p className="mt-10 text-center text-sm text-muted" role="status">
        저장된 플랜을 불러오는 중…
      </p>
    );
  }

  if (!currentPlan) {
    return (
      <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-base font-semibold text-ink">사용 계획을 시작해 보세요</p>
        <p className="mt-2 text-sm text-muted">
          세후 당첨금을 입력하면 카테고리별로 나눠 쓸 수 있습니다. 입력 내용은 이 기기에만
          저장되며 서버로 전송되지 않습니다.
        </p>
        <div className="mx-auto mt-6 max-w-xs">
          <MoneyInput
            id="bootstrap-total"
            label="세후 총당첨금 (원)"
            value={bootstrapTotal}
            onChange={setBootstrapTotal}
            placeholder="예: 1,300,000,000"
          />
        </div>
        <button
          type="button"
          onClick={() => void createPlan(bootstrapTotal, '플랜 1')}
          disabled={bootstrapTotal <= 0}
          className="mt-6 min-h-[48px] rounded-full bg-brand px-8 font-bold text-white shadow-md transition hover:bg-brand-dark disabled:opacity-50"
        >
          플랜 만들기
        </button>
        <p className="mt-4 text-sm">
          <Link href="/calculator/tax" className="font-semibold text-brand underline">
            세금 계산기
          </Link>
          에서 실수령액을 계산한 뒤 연결할 수도 있습니다.
        </p>
      </div>
    );
  }

  const wishlist = wishlistItems(currentPlan.items);

  return (
    <div className="mt-8 space-y-8">
      <div className="sticky top-14 z-40 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md sm:top-16">
        <dl className="grid grid-cols-3 gap-2 text-center sm:gap-4">
          <div className="rounded-xl bg-slate-50 px-2 py-3 sm:px-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
              세후 총당첨금
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-ink sm:text-base">
              {formatKoreanAmount(currentPlan.totalAmount)}
            </dd>
          </div>
          <div className="rounded-xl bg-amber-50/80 px-2 py-3 sm:px-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
              사용액
            </dt>
            <dd className="mt-1 text-sm font-bold tabular-nums text-ink sm:text-base">
              {formatKoreanAmount(totals.spent)}
            </dd>
          </div>
          <div
            className={`rounded-xl px-2 py-3 sm:px-3 ${
              totals.isOverBudget ? 'bg-red-50 ring-2 ring-red-300' : 'bg-emerald-50/80'
            }`}
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
              남은 금액
            </dt>
            <dd
              className={`mt-1 text-sm font-extrabold tabular-nums sm:text-base ${
                totals.isOverBudget ? 'text-red-600' : 'text-emerald-800'
              }`}
            >
              {totals.isOverBudget ? '−' : ''}
              {formatKoreanAmount(Math.abs(totals.remaining))}
            </dd>
          </div>
        </dl>
        {totals.isOverBudget && (
          <p className="mt-3 text-center text-sm font-semibold text-red-600" role="alert">
            예산을 {formatKRW(Math.abs(totals.remaining))} 초과했습니다. 항목을 줄여 주세요.
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-ink">시나리오</h2>
        <p className="mt-1 text-xs text-muted">
          플랜 A/B/C를 저장해 두고 비교할 수 있습니다. (이 기기에만 저장)
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="plan-select" className="sr-only">
              플랜 선택
            </label>
            <select
              id="plan-select"
              value={currentPlan.id}
              onChange={(e) => void setCurrentPlan(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-ink"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {formatKoreanAmount(p.totalAmount)}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            aria-label="플랜 이름"
            value={planNameDraft}
            onChange={(e) => setPlanNameDraft(e.target.value)}
            onBlur={() => void renameCurrentPlan(planNameDraft)}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-slate-200 px-4 text-sm font-medium text-ink sm:max-w-[200px]"
          />
          <button
            type="button"
            onClick={() => setNewPlanOpen((v) => !v)}
            className="min-h-[48px] rounded-xl border-2 border-brand bg-white px-4 text-sm font-bold text-brand hover:bg-blue-50"
          >
            + 새 플랜
          </button>
          <button
            type="button"
            onClick={() => {
              const msg =
                plans.length === 1
                  ? `「${currentPlan.name}」 플랜을 삭제할까요? 저장된 플랜이 모두 사라지고 처음 화면으로 돌아갑니다.`
                  : `「${currentPlan.name}」 플랜을 삭제할까요?`;
              if (confirm(msg)) void deletePlan(currentPlan.id);
            }}
            className="min-h-[48px] rounded-xl border-2 border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            플랜 삭제
          </button>
        </div>
        {newPlanOpen && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <MoneyInput
                id="new-plan-total"
                label="새 플랜 세후 총액"
                value={newPlanTotal}
                onChange={setNewPlanTotal}
              />
            </div>
            <button
              type="button"
              onClick={() => void handleNewPlan()}
              className="min-h-[48px] shrink-0 rounded-xl bg-brand px-6 font-bold text-white"
            >
              만들기
            </button>
          </div>
        )}
      </section>

      <section>
        <MoneyInput
          id="plan-total"
          label="세후 총당첨금 (원)"
          value={currentPlan.totalAmount}
          onChange={(n) => void setTotalAmount(n)}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">카테고리별 사용</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SINGLE_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <article
                key={cat}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
              >
                <p className="text-sm font-bold text-ink">
                  <span className="mr-1.5" aria-hidden>
                    {meta.icon}
                  </span>
                  {meta.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">{meta.hint}</p>
                <div className="mt-3">
                  <MoneyInput
                    id={`cat-${cat}`}
                    label={`${meta.label} 금액`}
                    value={amountForCategory(currentPlan.items, cat)}
                    onChange={(n) => void setCategoryAmount(cat as SingleSpendingCategory, n)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-gold/30 bg-amber-50/30 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">
          <span className="mr-1.5" aria-hidden>
            {CATEGORY_META.wishlist.icon}
          </span>
          {CATEGORY_META.wishlist.label}
        </h2>
        <p className="mt-1 text-xs text-muted">{CATEGORY_META.wishlist.hint}</p>

        {wishlist.length > 0 && (
          <ul className="mt-4 space-y-3">
            {wishlist.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => void updateItem(item.id, { name: e.target.value })}
                  className="min-h-[44px] flex-1 rounded-lg border border-slate-200 px-3 text-sm font-medium"
                  aria-label="항목 이름"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={item.amount > 0 ? item.amount.toLocaleString('ko-KR') : ''}
                  onChange={(e) =>
                    void updateItem(item.id, { amount: parseKRW(e.target.value) })
                  }
                  className="min-h-[44px] w-full rounded-lg border border-slate-200 px-3 text-sm font-medium tabular-nums sm:w-40"
                  aria-label="금액"
                />
                <button
                  type="button"
                  onClick={() => void removeItem(item.id)}
                  className="min-h-[44px] shrink-0 rounded-lg px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
          <div>
            <label htmlFor="wish-name" className="mb-1.5 block text-sm font-semibold text-ink">
              항목 이름
            </label>
            <input
              id="wish-name"
              type="text"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="예: 세계 여행"
              className="w-full min-h-[48px] rounded-xl border-2 border-slate-200 px-4 text-sm"
            />
          </div>
          <div>
            <label htmlFor="wish-amt" className="mb-1.5 block text-sm font-semibold text-ink">
              금액
            </label>
            <input
              id="wish-amt"
              type="text"
              inputMode="numeric"
              value={wishAmount}
              onChange={(e) => setWishAmount(e.target.value.replace(/[^\d,]/g, ''))}
              placeholder="0"
              className="w-full min-h-[48px] rounded-xl border-2 border-slate-200 px-4 text-sm tabular-nums"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const amount = parseKRW(wishAmount);
              if (amount <= 0) return;
              void addWishlistItem(wishName, amount);
              setWishName('');
              setWishAmount('');
            }}
            className="min-h-[48px] rounded-xl bg-gold px-5 font-bold text-ink shadow-sm hover:brightness-105"
          >
            + 추가
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">비율 차트</h2>
        <div
          id="spending-plan-share-card"
          className="mt-3 rounded-xl bg-white px-3 pb-2 pt-3 ring-1 ring-slate-100"
        >
          <p className="mb-2 text-center text-sm font-bold text-ink">
            {currentPlan.name} · 세후 {formatKoreanAmount(currentPlan.totalAmount)}
          </p>
          <SpendingPlanChart segments={segments} baseTotal={currentPlan.totalAmount} />
        </div>
        <SpendingPlanShare
          plan={currentPlan}
          captureTargetId="spending-plan-share-card"
          disabled={segments.length === 0}
        />
      </section>

      <p className="text-xs leading-relaxed text-muted">
        ※ 사용 계획은 서버로 전송되지 않으며, 이 브라우저에만 저장됩니다. 세후
        총액은{' '}
        <Link href="/calculator/tax" className="font-medium text-brand underline">
          세금 계산기
        </Link>
        결과를 참고해 입력하세요.
      </p>
    </div>
  );
}
