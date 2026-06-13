import type { FrequencyWeights } from '@/lib/core/stats/frequency';
import { scoreCombination } from '@/lib/core/stats/frequency';

export interface GenerateOptions {
  fixedNumbers?: number[];
  /** true + frequencyWeights 이면 과거 출현 빈도 가중 */
  useStatistics?: boolean;
  frequencyWeights?: FrequencyWeights;
  count?: number;
  /** 이전에 보여준 세트와 동일 조합 제외 (재생성 시) */
  excludeSets?: number[][];
}

const MIN_NUM = 1;
const MAX_NUM = 45;
const MAX_FIXED = 5;
const MAX_ATTEMPTS = 200;
const CANDIDATE_POOL = 200;
const MAX_OVERLAP_BETWEEN_SETS = 3;

function shuffle<T>(pool: T[]): void {
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
}

function setKey(nums: number[]): string {
  return [...nums].sort((a, b) => a - b).join(',');
}

function isExcluded(nums: number[], excludeSets?: number[][]): boolean {
  if (!excludeSets?.length) return false;
  const key = setKey(nums);
  return excludeSets.some((s) => setKey(s) === key);
}

/** 매 생성마다 가중치를 흔들어 핫넘버만 고정되지 않게 */
export function jitterFrequencyWeights(
  weights: FrequencyWeights,
  strength = 0.45
): FrequencyWeights {
  const out = new Map<number, number>();
  for (let n = MIN_NUM; n <= MAX_NUM; n++) {
    const base = weights.get(n) ?? 1;
    const factor = 1 + (Math.random() * 2 - 1) * strength;
    out.set(n, Math.max(1, Math.round(base * factor)));
  }
  return out;
}

export function overlapCount(a: number[], b: number[]): number {
  const setB = new Set(b);
  return a.filter((n) => setB.has(n)).length;
}

export function isDiverseFromSelected(
  nums: number[],
  selected: number[][],
  maxOverlap = MAX_OVERLAP_BETWEEN_SETS
): boolean {
  return selected.every((s) => overlapCount(nums, s) <= maxOverlap);
}

function weightedPick(pool: number[], weights: FrequencyWeights, pick: number): number[] {
  const remaining = [...pool];
  const chosen: number[] = [];
  while (chosen.length < pick && remaining.length > 0) {
    const total = remaining.reduce((s, n) => s + (weights.get(n) ?? 1), 0);
    let r = Math.random() * total;
    let pickedIndex = remaining.length - 1;
    for (let i = 0; i < remaining.length; i++) {
      r -= weights.get(remaining[i]) ?? 1;
      if (r <= 0) {
        pickedIndex = i;
        break;
      }
    }
    chosen.push(remaining[pickedIndex]);
    remaining.splice(pickedIndex, 1);
  }
  return chosen;
}

export function validateFixedNumbers(fixedNumbers: number[]): void {
  if (fixedNumbers.length > MAX_FIXED) {
    throw new Error('고정 번호는 최대 5개');
  }
  if (fixedNumbers.some((n) => n < MIN_NUM || n > MAX_NUM)) {
    throw new Error('1~45 범위');
  }
  if (new Set(fixedNumbers).size !== fixedNumbers.length) {
    throw new Error('중복 X');
  }
}

/** §2.6 검증 규칙 — 정렬된 6개 번호 */
export function passesValidation(nums: number[]): boolean {
  if (nums.length !== 6) return false;
  if (new Set(nums).size !== 6) return false;

  const odd = nums.filter((n) => n % 2 === 1).length;
  if (odd <= 1 || odd >= 5) return false;

  const low = nums.filter((n) => n <= 22).length;
  if (low <= 1 || low >= 5) return false;

  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum < 100 || sum > 175) return false;

  let maxConsec = 1;
  let curr = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      curr++;
      maxConsec = Math.max(maxConsec, curr);
    } else {
      curr = 1;
    }
  }
  if (maxConsec > 2) return false;

  const endSum = nums.reduce((a, b) => a + (b % 10), 0);
  if (endSum < 14 || endSum > 40) return false;

  const endCounts = new Map<number, number>();
  for (const n of nums) {
    endCounts.set(n % 10, (endCounts.get(n % 10) ?? 0) + 1);
  }
  if (Array.from(endCounts.values()).some((c) => c > 2)) return false;

  return true;
}

export function generateLottoNumbers(opts: GenerateOptions = {}): number[] {
  const {
    fixedNumbers = [],
    useStatistics = false,
    frequencyWeights,
  } = opts;
  validateFixedNumbers(fixedNumbers);

  const useWeights = useStatistics && frequencyWeights && frequencyWeights.size > 0;

  let lastCandidate: number[] = [];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidates = [...fixedNumbers];
    const pool = Array.from({ length: MAX_NUM }, (_, i) => i + MIN_NUM).filter(
      (n) => !candidates.includes(n)
    );

    const need = 6 - candidates.length;
    if (useWeights && frequencyWeights) {
      candidates.push(...weightedPick(pool, frequencyWeights, need));
    } else {
      shuffle(pool);
      candidates.push(...pool.slice(0, need));
    }
    candidates.sort((a, b) => a - b);
    lastCandidate = candidates;

    if (passesValidation(candidates)) return candidates;
  }

  return lastCandidate;
}

function generateTopScoredSets(opts: GenerateOptions, count: number): number[][] {
  const baseWeights = opts.frequencyWeights!;
  const sessionWeights = jitterFrequencyWeights(baseWeights);
  const ranked: { nums: number[]; score: number }[] = [];
  const seen = new Set<string>();

  for (const ex of opts.excludeSets ?? []) {
    seen.add(setKey(ex));
  }

  for (let i = 0; i < CANDIDATE_POOL; i++) {
    const nums = generateLottoNumbers({
      ...opts,
      useStatistics: true,
      frequencyWeights: jitterFrequencyWeights(sessionWeights, 0.2),
    });
    if (!passesValidation(nums)) continue;
    const key = setKey(nums);
    if (seen.has(key)) continue;
    seen.add(key);
    const score = scoreCombination(nums, baseWeights) + Math.random() * 2;
    ranked.push({ nums, score });
  }

  ranked.sort((a, b) => b.score - a.score);

  const tierSize = Math.min(ranked.length, Math.max(50, count * 12));
  const tier = ranked.slice(0, tierSize);
  shuffle(tier);

  const sets: number[][] = [];
  for (const c of tier) {
    if (sets.length >= count) break;
    if (!isDiverseFromSelected(c.nums, sets)) continue;
    sets.push(c.nums);
  }

  let guard = 0;
  while (sets.length < count && guard < count * 60) {
    guard++;
    const nums = generateLottoNumbers({
      ...opts,
      useStatistics: true,
      frequencyWeights: sessionWeights,
    });
    if (!passesValidation(nums)) continue;
    if (isExcluded(nums, opts.excludeSets)) continue;
    if (!isDiverseFromSelected(nums, sets)) continue;
    const key = setKey(nums);
    if (sets.some((s) => setKey(s) === key)) continue;
    sets.push(nums);
  }

  return sets;
}

/** 한 번에 여러 세트 (기본 5) — 통계 모드면 출현 점수 상위 조합 */
export function generateLottoNumberSets(opts: GenerateOptions = {}): number[][] {
  const count = opts.count ?? 5;
  const useStats =
    opts.useStatistics !== false &&
    opts.frequencyWeights &&
    opts.frequencyWeights.size > 0;

  if (useStats) {
    return generateTopScoredSets({ ...opts, useStatistics: true }, count);
  }

  const sets: number[][] = [];
  const seen = new Set<string>();
  let guard = 0;
  const maxGuard = count * 80;

  for (const ex of opts.excludeSets ?? []) {
    seen.add(setKey(ex));
  }

  while (sets.length < count && guard < maxGuard) {
    guard++;
    const nums = generateLottoNumbers(opts);
    if (!passesValidation(nums)) continue;
    const key = setKey(nums);
    if (seen.has(key)) continue;
    if (!isDiverseFromSelected(nums, sets)) continue;
    seen.add(key);
    sets.push(nums);
  }

  while (sets.length < count) {
    sets.push(generateLottoNumbers(opts));
  }

  return sets;
}
