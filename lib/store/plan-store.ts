'use client';

import { create } from 'zustand';
import { CATEGORY_META, SINGLE_CATEGORIES } from '@/lib/core/spending/categories';
import { newItemId, newPlanId } from '@/lib/core/spending/ids';
import { planTotals } from '@/lib/core/spending/plan-math';
import { getPlanDb } from '@/lib/db/schema';
import type { SingleSpendingCategory } from '@/lib/core/spending/categories';
import type { SpendingCategory, SpendingItem, SpendingPlan } from '@/lib/types/spending';

interface PlanStore {
  hydrated: boolean;
  currentPlan: SpendingPlan | null;
  plans: SpendingPlan[];

  loadPlans: () => Promise<void>;
  createPlan: (totalAmount: number, name?: string) => Promise<void>;
  setCurrentPlan: (planId: string) => Promise<void>;
  renameCurrentPlan: (name: string) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  setTotalAmount: (totalAmount: number) => Promise<void>;
  setCategoryAmount: (category: SingleSpendingCategory, amount: number) => Promise<void>;
  addWishlistItem: (name: string, amount: number) => Promise<void>;
  updateItem: (id: string, patch: Partial<Pick<SpendingItem, 'name' | 'amount' | 'memo'>>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;

  spent: () => number;
  remaining: () => number;
  isOverBudget: () => boolean;
}

async function persistPlan(plan: SpendingPlan): Promise<void> {
  const db = getPlanDb();
  await db.plans.put(plan);
}

function defaultItemName(category: SpendingCategory): string {
  return CATEGORY_META[category].label;
}

function upsertCategoryItem(
  items: SpendingItem[],
  category: SingleSpendingCategory,
  amount: number
): SpendingItem[] {
  const next = items.filter((i) => i.category !== category);
  if (amount > 0) {
    next.push({
      id: newItemId(),
      category,
      name: defaultItemName(category),
      amount,
    });
  }
  return next;
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  hydrated: false,
  currentPlan: null,
  plans: [],

  loadPlans: async () => {
    const db = getPlanDb();
    const plans = await db.plans.orderBy('updatedAt').reverse().toArray();
    set({
      plans,
      currentPlan: plans[0] ?? null,
      hydrated: true,
    });
  },

  createPlan: async (totalAmount, name) => {
    const now = new Date().toISOString();
    const plan: SpendingPlan = {
      id: newPlanId(),
      name: name?.trim() || `플랜 ${get().plans.length + 1}`,
      totalAmount: Math.max(0, Math.trunc(totalAmount)),
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    await persistPlan(plan);
    const plans = [plan, ...get().plans];
    set({ plans, currentPlan: plan });
  },

  setCurrentPlan: async (planId) => {
    const plan = get().plans.find((p) => p.id === planId);
    if (!plan) return;
    set({ currentPlan: plan });
  },

  renameCurrentPlan: async (name) => {
    const current = get().currentPlan;
    if (!current) return;
    const updated: SpendingPlan = {
      ...current,
      name: name.trim() || current.name,
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  deletePlan: async (planId) => {
    const db = getPlanDb();
    await db.plans.delete(planId);
    const plans = get().plans.filter((p) => p.id !== planId);
    const currentPlan =
      get().currentPlan?.id === planId ? (plans[0] ?? null) : get().currentPlan;
    set({ plans, currentPlan });
  },

  setTotalAmount: async (totalAmount) => {
    const current = get().currentPlan;
    if (!current) return;
    const updated: SpendingPlan = {
      ...current,
      totalAmount: Math.max(0, Math.trunc(totalAmount)),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  setCategoryAmount: async (category, amount) => {
    const current = get().currentPlan;
    if (!current) return;
    const updated: SpendingPlan = {
      ...current,
      items: upsertCategoryItem(current.items, category, Math.max(0, Math.trunc(amount))),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  addWishlistItem: async (name, amount) => {
    const current = get().currentPlan;
    if (!current) return;
    const trimmed = name.trim() || '위시리스트';
    const value = Math.max(0, Math.trunc(amount));
    if (value <= 0) return;
    const item: SpendingItem = {
      id: newItemId(),
      category: 'wishlist',
      name: trimmed,
      amount: value,
    };
    const updated: SpendingPlan = {
      ...current,
      items: [...current.items, item],
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  updateItem: async (id, patch) => {
    const current = get().currentPlan;
    if (!current) return;
    const updated: SpendingPlan = {
      ...current,
      items: current.items.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          ...patch,
          amount:
            patch.amount !== undefined
              ? Math.max(0, Math.trunc(patch.amount))
              : item.amount,
          name: patch.name !== undefined ? patch.name.trim() || item.name : item.name,
        };
      }),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  removeItem: async (id) => {
    const current = get().currentPlan;
    if (!current) return;
    const updated: SpendingPlan = {
      ...current,
      items: current.items.filter((i) => i.id !== id),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(updated);
    set({
      currentPlan: updated,
      plans: get().plans.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  spent: () => {
    const plan = get().currentPlan;
    if (!plan) return 0;
    return planTotals(plan).spent;
  },

  remaining: () => {
    const plan = get().currentPlan;
    if (!plan) return 0;
    return planTotals(plan).remaining;
  },

  isOverBudget: () => {
    const plan = get().currentPlan;
    if (!plan) return false;
    return planTotals(plan).isOverBudget;
  },
}));
