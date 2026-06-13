/**
 * luck-stores.json → luck-stores.slim.json (회차 배열 제거, 용량·로딩 개선)
 *   node scripts/compact-luck-stores.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'stores');
const fullPath = path.join(dir, 'luck-stores.json');
const slimPath = path.join(dir, 'luck-stores.slim.json');

const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
if (!Array.isArray(raw)) throw new Error('luck-stores.json 형식 오류');

const slim = raw.map((s) => {
  const draws = s.firstPrizeDraws ?? [];
  const { firstPrizeDraws: _d, ...rest } = s;
  return {
    ...rest,
    firstPrizeCount: rest.firstPrizeCount ?? draws.length,
    recentDraws: draws.length > 0 ? draws.slice(-5) : undefined,
  };
});

fs.writeFileSync(slimPath, JSON.stringify(slim), 'utf8');
const fullMb = (fs.statSync(fullPath).size / 1024 / 1024).toFixed(2);
const slimMb = (fs.statSync(slimPath).size / 1024 / 1024).toFixed(2);
console.log(`[compact] ${raw.length}곳 · ${fullMb}MB → ${slimMb}MB (${slimPath})`);
