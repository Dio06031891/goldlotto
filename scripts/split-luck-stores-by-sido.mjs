/**
 * slim JSON → 시도별 파일 + TOP50
 *   node scripts/split-luck-stores-by-sido.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const slimPath = path.join(root, 'data', 'stores', 'luck-stores.slim.json');
const sidoDir = path.join(root, 'data', 'stores', 'sido');
const topPath = path.join(root, 'data', 'stores', 'luck-stores-top50.json');

const SIDO_SLUG = {
  서울: 'seoul',
  부산: 'busan',
  대구: 'daegu',
  인천: 'incheon',
  광주: 'gwangju',
  대전: 'daejeon',
  울산: 'ulsan',
  세종: 'sejong',
  경기: 'gyeonggi',
  강원: 'gangwon',
  충북: 'chungbuk',
  충남: 'chungnam',
  전북: 'jeonbuk',
  전남: 'jeonnam',
  경북: 'gyeongbuk',
  경남: 'gyeongnam',
  제주: 'jeju',
};

const stores = JSON.parse(fs.readFileSync(slimPath, 'utf8'));
fs.mkdirSync(sidoDir, { recursive: true });

const bySido = new Map();
for (const s of stores) {
  const slug = SIDO_SLUG[s.sido] ?? `other-${s.sido}`;
  if (!bySido.has(slug)) bySido.set(slug, []);
  bySido.get(slug).push(s);
}

for (const [slug, list] of bySido) {
  list.sort(
    (a, b) =>
      b.firstPrizeCount - a.firstPrizeCount || a.name.localeCompare(b.name, 'ko')
  );
  fs.writeFileSync(path.join(sidoDir, `${slug}.json`), JSON.stringify(list), 'utf8');
}

const top50 = [...stores]
  .sort(
    (a, b) =>
      b.firstPrizeCount - a.firstPrizeCount || a.name.localeCompare(b.name, 'ko')
  )
  .slice(0, 50);
fs.writeFileSync(topPath, JSON.stringify(top50), 'utf8');

console.log(`[split] ${bySido.size}개 시도 파일, TOP50 ${top50.length}곳`);
