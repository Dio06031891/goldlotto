/**
 * 동행복권 API·로컬 명당 메타 상태 점검 (GitHub Actions 등)
 *   node scripts/verify-lotto-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const metaPath = path.join(root, 'data', 'stores', 'luck-stores.meta.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchLatestDrwNo() {
  const url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchLtEpsd=all&_=${Date.now()}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
      'User-Agent': UA,
    },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`당첨번호 API HTTP ${res.status}`);
  const json = await res.json();
  const list = json?.data?.list;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('당첨번호 API 응답이 비어 있습니다.');
  }
  let max = 0;
  let sample = null;
  for (const row of list) {
    const n = Number(row.ltEpsd ?? row.drwNo);
    if (Number.isFinite(n) && n > max) {
      max = n;
      sample = row;
    }
  }
  return { latest: max, sample };
}

async function main() {
  const { latest, sample } = await fetchLatestDrwNo();
  console.log(`[verify-lotto-data] 동행복권 최신 회차: ${latest}회`);

  const nums = [
    sample?.tm1WnNo ?? sample?.drwtNo1,
    sample?.tm2WnNo ?? sample?.drwtNo2,
    sample?.tm3WnNo ?? sample?.drwtNo3,
    sample?.tm4WnNo ?? sample?.drwtNo4,
    sample?.tm5WnNo ?? sample?.drwtNo5,
    sample?.tm6WnNo ?? sample?.drwtNo6,
  ].filter((n) => Number.isFinite(Number(n)));
  if (nums.length !== 6) {
    throw new Error(`${latest}회 당첨번호 6개를 확인하지 못했습니다.`);
  }
  console.log(`[verify-lotto-data] ${latest}회 당첨번호 샘플: ${nums.join(', ')}`);

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const gap = latest - (meta.toDrwNo ?? 0);
    console.log(
      `[verify-lotto-data] 명당 JSON: ${meta.toDrwNo}회까지 (${meta.storeCount}곳, synced ${meta.syncedAt})`
    );
    if (gap > 1) {
      console.warn(
        `[verify-lotto-data] ⚠ 명당 데이터가 API보다 ${gap}회 뒤처져 있습니다. sync:stores:incremental 실행 권장.`
      );
    }
  } else {
    console.warn('[verify-lotto-data] luck-stores.meta.json 없음 — 명당 동기화 미실행');
  }

  console.log('[verify-lotto-data] OK');
}

main().catch((e) => {
  console.error('[verify-lotto-data] FAIL:', e.message ?? e);
  process.exit(1);
});
