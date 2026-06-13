import fs from 'node:fs';
import path from 'node:path';
import { findSidoBySlug, type SidoInfo } from '@/lib/stores/korea-regions';
import type { LottoStore } from '@/lib/types/store';
import { SEED_LUCK_STORES } from '@/lib/stores/seed-luck-stores';

export type LuckStoresMeta = {
  source: string;
  syncedAt: string;
  fromDrwNo: number;
  toDrwNo: number;
  storeCount: number;
  drawsProcessed: number;
  drawsFailed?: number[];
  dataNote?: string;
};

const dataDir = path.join(process.cwd(), 'data', 'stores');
const slimPath = path.join(dataDir, 'luck-stores.slim.json');
const fullPath = path.join(dataDir, 'luck-stores.json');
const topPath = path.join(dataDir, 'luck-stores-top50.json');
const sidoDir = path.join(dataDir, 'sido');
const metaPath = path.join(dataDir, 'luck-stores.meta.json');

let allCache: LottoStore[] | null = null;
let metaCache: LuckStoresMeta | null | undefined;
const sidoCache = new Map<string, LottoStore[]>();

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function normalizeStore(raw: LottoStore): LottoStore {
  const draws = raw.firstPrizeDraws ?? raw.recentDraws ?? [];
  const count = raw.firstPrizeCount ?? draws.length;
  return {
    ...raw,
    firstPrizeCount: count,
    firstPrizeDraws: raw.firstPrizeDraws ?? (raw.recentDraws ? [...raw.recentDraws] : []),
  };
}

function loadAllFromMonolith(): LottoStore[] | null {
  const slim = readJsonFile<LottoStore[]>(slimPath);
  if (Array.isArray(slim) && slim.length > 0) {
    return slim.map(normalizeStore);
  }
  const full = readJsonFile<LottoStore[]>(fullPath);
  if (Array.isArray(full) && full.length > 0) {
    return full.map(normalizeStore);
  }
  return null;
}

function loadAllFromSidoShards(): LottoStore[] | null {
  if (!fs.existsSync(sidoDir)) return null;
  const files = fs.readdirSync(sidoDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return null;
  const out: LottoStore[] = [];
  for (const file of files) {
    const chunk = readJsonFile<LottoStore[]>(path.join(sidoDir, file));
    if (chunk) out.push(...chunk.map(normalizeStore));
  }
  return out.length > 0 ? out : null;
}

/** 전체 목록 (검색·정렬용, 최초 1회만 로드) */
export function loadLuckStoresFromDisk(): LottoStore[] {
  if (allCache) return allCache;
  allCache =
    loadAllFromSidoShards() ?? loadAllFromMonolith() ?? SEED_LUCK_STORES;
  return allCache;
}

export function loadTopLuckStores(limit: number): LottoStore[] {
  const top = readJsonFile<LottoStore[]>(topPath);
  if (top && top.length > 0) {
    return top.slice(0, limit).map(normalizeStore);
  }
  return [...loadLuckStoresFromDisk()]
    .sort(
      (a, b) =>
        b.firstPrizeCount - a.firstPrizeCount ||
        a.name.localeCompare(b.name, 'ko')
    )
    .slice(0, limit);
}

export function loadLuckStoresBySido(sido: SidoInfo): LottoStore[] {
  const cached = sidoCache.get(sido.slug);
  if (cached) return cached;

  const shardPath = path.join(sidoDir, `${sido.slug}.json`);
  const shard = readJsonFile<LottoStore[]>(shardPath);
  if (shard && shard.length > 0) {
    const list = shard.map(normalizeStore);
    sidoCache.set(sido.slug, list);
    return list;
  }

  const key = sido.shortName;
  const list = loadLuckStoresFromDisk().filter(
    (s) => s.sido === key || s.sido.startsWith(key) || sido.name.startsWith(s.sido)
  );
  sidoCache.set(sido.slug, list);
  return list;
}

export function loadLuckStoresMetaFromDisk(): LuckStoresMeta | null {
  if (metaCache !== undefined) return metaCache;
  const raw = readJsonFile<LuckStoresMeta>(metaPath);
  const hasData =
    fs.existsSync(topPath) ||
    fs.existsSync(slimPath) ||
    fs.existsSync(fullPath) ||
    fs.existsSync(sidoDir);
  if (!raw?.syncedAt || !hasData) {
    metaCache = null;
    return null;
  }
  metaCache = raw;
  return metaCache;
}

export function clearLuckStoresLoaderCache(): void {
  allCache = null;
  metaCache = undefined;
  sidoCache.clear();
}
