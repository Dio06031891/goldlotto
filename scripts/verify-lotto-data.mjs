/**
 * 동행복권 API·로컬 명당 메타 상태 점검 (GitHub Actions 등)
 *   node scripts/verify-lotto-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const metaPath = path.join(root, 'data', 'stores', 'luck-stores.meta.json');
const snapshotPath = path.join(root, 'data', 'lotto', 'latest-draw.snapshot.json');

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

function rowToSnapshot(row) {
  const ymd = String(row.ltRflYmd ?? '').trim();
  const drwNoDate =
    ymd.length === 8 ? `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}` : null;
  const numbers = [1, 2, 3, 4, 5, 6]
    .map((i) => Number(row[`tm${i}WnNo`]))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  if (!drwNoDate || numbers.length !== 6) return null;
  return {
    returnValue: 'success',
    drwNo: Number(row.ltEpsd),
    drwNoDate,
    numbers,
    bonus: Number(row.bnsWnNo),
    firstWinnerCount: Number(row.rnk1WnNope),
    firstWinamnt: Number(row.rnk1WnAmt),
    secondWinamnt: Number(row.rnk2WnAmt),
    thirdWinamnt: Number(row.rnk3WnAmt),
    fourthWinamnt: Number(row.rnk4WnAmt),
    fifthWinamnt: Number(row.rnk5WnAmt),
    snapshotAt: new Date().toISOString(),
  };
}

async function main() {
  const { latest, sample } = await fetchLatestDrwNo();
  console.log(`[verify-lotto-data] 동행복권 최신 회차: ${latest}회`);

  const snap = rowToSnapshot(sample);
  if (snap) {
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
    fs.writeFileSync(snapshotPath, `${JSON.stringify(snap, null, 2)}\n`, 'utf8');
    console.log(`[verify-lotto-data] 스냅샷 갱신 → data/lotto/latest-draw.snapshot.json (${latest}회)`);
  }

  const nums = snap?.numbers ?? [];
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
    if (gap >= 1) {
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
