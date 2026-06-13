/**
 * 동행복권 1등 당첨 판매점 전 회차 집계 → data/stores/luck-stores.json
 *
 *   npm run sync:stores
 *   node scripts/sync-winning-stores.mjs --from 300 --delay 200
 *   node scripts/sync-winning-stores.mjs --resume
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'data', 'stores');
const outJson = path.join(outDir, 'luck-stores.json');
const outSlim = path.join(outDir, 'luck-stores.slim.json');
const outMeta = path.join(outDir, 'luck-stores.meta.json');
const cachePath = path.join(outDir, 'sync-draw-cache.ndjson');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const ONLINE_ID = '51100000';
/** API에 당첨 판매점 목록이 실질적으로 쌓이기 시작하는 회차 근처 */
const DEFAULT_FROM = 262;

function parseArgs(argv) {
  const opts = {
    from: DEFAULT_FROM,
    to: null,
    delay: 200,
    resume: false,
    patchFailed: false,
    incremental: false,
    force: false,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--from') opts.from = Number(argv[++i]);
    else if (argv[i] === '--to') opts.to = Number(argv[++i]);
    else if (argv[i] === '--delay') opts.delay = Number(argv[++i]);
    else if (argv[i] === '--resume') opts.resume = true;
    else if (argv[i] === '--patch-failed') opts.patchFailed = true;
    else if (argv[i] === '--incremental') opts.incremental = true;
    else if (argv[i] === '--force') opts.force = true;
  }
  return opts;
}

function loadExistingStores() {
  for (const p of [outSlim, outJson]) {
    if (!fs.existsSync(p)) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (Array.isArray(raw)) return raw;
    } catch {
      /* try next */
    }
  }
  return [];
}

function patchStoresFromDraws(stores, drawPatches) {
  const byId = new Map(stores.map((s) => [s.ltShpId ?? s.id.replace(/^lt-/, ''), s]));
  for (const { drwNo, rows } of drawPatches) {
    for (const row of firstPrizeForDraw(rows)) {
      const key = row.ltShpId;
      let store = byId.get(key);
      if (!store) {
        const name = String(row.shpNm ?? '').trim();
        const roadAddress = String(row.shpAddr ?? '').trim();
        if (!name || !roadAddress) continue;
        store = {
          id: `lt-${key}`,
          ltShpId: key,
          name,
          roadAddress,
          sido: String(row.region ?? '').trim() || '기타',
          sigungu: sigunguFrom(row),
          lat: row.shpLat,
          lng: row.shpLot,
          phone: row.shpTelno?.trim() || undefined,
          firstPrizeCount: 0,
          firstPrizeDraws: [],
          dealType: atmtPsvToDealType(row.atmtPsvYn),
        };
        byId.set(key, store);
      }
      const knownDraws = store.firstPrizeDraws ?? store.recentDraws ?? [];
      if (knownDraws.includes(drwNo)) continue;
      if (Array.isArray(store.firstPrizeDraws)) {
        store.firstPrizeDraws.push(drwNo);
        store.firstPrizeCount = store.firstPrizeDraws.length;
      } else {
        store.firstPrizeCount = (store.firstPrizeCount ?? 0) + 1;
        store.recentDraws = [drwNo, ...(store.recentDraws ?? [])]
          .filter((n, i, a) => a.indexOf(n) === i)
          .sort((a, b) => b - a)
          .slice(0, 5);
      }
      store.dealType = atmtPsvToDealType(row.atmtPsvYn) ?? store.dealType;
    }
  }
  return [...byId.values()].sort(
    (a, b) =>
      b.firstPrizeCount - a.firstPrizeCount ||
      a.name.localeCompare(b.name, 'ko')
  );
}

function winningShopUrl(drwNo) {
  return `https://www.dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do?srchLtEpsd=${drwNo}`;
}

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
  const json = await res.json();
  const list = json?.data?.list;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('최신 회차를 가져오지 못했습니다.');
  }
  let max = 0;
  for (const row of list) {
    const n = Number(row.ltEpsd ?? row.drwNo);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

async function resolveLatestDrwNo(explicitTo) {
  if (explicitTo) return explicitTo;
  try {
    return await fetchLatestDrwNo();
  } catch (e) {
    console.warn('[sync-winning-stores] 최신 회차 조회 실패, 1226 사용:', e.message ?? e);
    return 1226;
  }
}

async function fetchWinningRows(drwNo) {
  const maxAttempts = 6;
  let lastErr;
  for (let a = 0; a < maxAttempts; a++) {
    try {
      const res = await fetch(winningShopUrl(drwNo), {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Referer: 'https://www.dhlottery.co.kr/gameResult.do?method=byWin',
          'User-Agent': UA,
        },
        signal: AbortSignal.timeout(45_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return Array.isArray(json?.data?.list) ? json.data.list : [];
    } catch (e) {
      lastErr = e;
      const wait = Math.min(8000, 800 * 2 ** a);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function loadCache() {
  const map = new Map();
  if (!fs.existsSync(cachePath)) return map;
  const rl = readline.createInterface({
    input: fs.createReadStream(cachePath, 'utf8'),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const { drwNo, rows } = JSON.parse(line);
      if (Number.isFinite(drwNo)) map.set(drwNo, rows);
    } catch {
      /* skip bad line */
    }
  }
  return map;
}

function appendCache(drwNo, rows) {
  fs.appendFileSync(cachePath, `${JSON.stringify({ drwNo, rows })}\n`, 'utf8');
}

function atmtPsvToDealType(code) {
  if (code === 'Q') return 'auto';
  if (code === 'M') return 'manual';
  if (code === 'B') return 'semi';
  return undefined;
}

function firstPrizeForDraw(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    if (row.wnShpRnk !== 1) continue;
    if (row.ltShpId === ONLINE_ID) continue;
    if (seen.has(row.ltShpId)) continue;
    seen.add(row.ltShpId);
    out.push(row);
  }
  return out;
}

function sigunguFrom(row) {
  if (row.tm2ShpLctnAddr?.trim()) return row.tm2ShpLctnAddr.trim();
  const m = String(row.shpAddr ?? '').match(
    /(?:특별자치도|광역시|특별시|도)\s+([가-힣]+(?:시|군|구))/
  );
  return m?.[1] ?? '기타';
}

function aggregate(cacheMap) {
  const drawResults = [...cacheMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([drwNo, rows]) => ({ drwNo, rows }));
  const map = new Map();
  for (const { drwNo, rows } of drawResults) {
    for (const row of firstPrizeForDraw(rows)) {
      let e = map.get(row.ltShpId);
      if (!e) {
        const name = String(row.shpNm ?? '').trim();
        const roadAddress = String(row.shpAddr ?? '').trim();
        if (!name || !roadAddress) continue;
        e = {
          ltShpId: row.ltShpId,
          name,
          roadAddress,
          sido: String(row.region ?? '').trim() || '기타',
          sigungu: sigunguFrom(row),
          lat: row.shpLat,
          lng: row.shpLot,
          phone: row.shpTelno?.trim() || undefined,
          draws: [],
          dealType: atmtPsvToDealType(row.atmtPsvYn),
        };
        map.set(row.ltShpId, e);
      }
      if (!e.draws.includes(drwNo)) e.draws.push(drwNo);
      e.dealType = atmtPsvToDealType(row.atmtPsvYn) ?? e.dealType;
    }
  }
  return Array.from(map.values())
    .map((s) => {
      const sorted = [...s.draws].sort((a, b) => a - b);
      return {
        id: `lt-${s.ltShpId}`,
        ltShpId: s.ltShpId,
        name: s.name,
        roadAddress: s.roadAddress,
        sido: s.sido,
        sigungu: s.sigungu,
        lat: s.lat,
        lng: s.lng,
        phone: s.phone,
        firstPrizeCount: sorted.length,
        recentDraws: sorted.length > 0 ? sorted.slice(-5) : undefined,
        dealType: s.dealType,
      };
    })
    .sort(
      (a, b) =>
        b.firstPrizeCount - a.firstPrizeCount ||
        a.name.localeCompare(b.name, 'ko')
    );
}

async function runIncrementalSync(opts) {
  if (!fs.existsSync(outMeta)) {
    console.error('luck-stores.meta.json 이 없습니다. 먼저 npm run sync:stores 를 실행하세요.');
    process.exit(1);
  }
  const meta = JSON.parse(fs.readFileSync(outMeta, 'utf8'));
  const latest = await resolveLatestDrwNo(opts.to);
  const from = (meta.toDrwNo ?? DEFAULT_FROM - 1) + 1;
  const to = Math.min(latest, opts.to ?? latest);

  if (from > to) {
    console.log(
      `[sync-winning-stores] 이미 최신입니다. (meta ${meta.toDrwNo}회, API ${latest}회)`
    );
    return;
  }

  console.log(
    `[sync-winning-stores] 증분 동기화 ${from}~${to}회 (기존 ${meta.toDrwNo}회까지 반영됨)`
  );

  const patches = [];
  const failed = [];
  for (let drwNo = from; drwNo <= to; drwNo++) {
    try {
      if (opts.delay > 0) await new Promise((r) => setTimeout(r, opts.delay));
      const rows = await fetchWinningRows(drwNo);
      patches.push({ drwNo, rows });
      console.log(`  ✓ ${drwNo}회 (${rows.length}건)`);
    } catch (e) {
      failed.push(drwNo);
      console.warn(`  ✗ ${drwNo}회:`, e.message ?? e);
    }
  }

  const stores = patchStoresFromDraws(loadExistingStores(), patches);
  const syncedAt = new Date().toISOString();

  fs.writeFileSync(outSlim, JSON.stringify(stores), 'utf8');
  fs.writeFileSync(
    outMeta,
    JSON.stringify(
      {
        ...meta,
        syncedAt,
        toDrwNo: to,
        storeCount: stores.length,
        drawsProcessed: (meta.drawsProcessed ?? 0) + patches.length,
        drawsFailed:
          failed.length > 0
            ? [...new Set([...(meta.drawsFailed ?? []), ...failed])].sort((a, b) => a - b)
            : meta.drawsFailed,
        dataNote:
          failed.length > 0
            ? `증분 동기화 중 ${failed.length}개 회차 API 실패. npm run sync:stores:patch 로 재시도 가능.`
            : meta.dataNote,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(
    `[sync-winning-stores] 증분 완료: 명당 ${stores.length}곳, 신규 ${patches.length}회, 실패 ${failed.length}회`
  );
  await runPostProcess();
}

async function main() {
  const opts = parseArgs(process.argv);
  fs.mkdirSync(outDir, { recursive: true });

  if (opts.incremental) {
    await runIncrementalSync(opts);
    return;
  }

  if (opts.patchFailed) {
    if (!fs.existsSync(outMeta)) {
      console.error('luck-stores.meta.json 이 없습니다. 먼저 npm run sync:stores 를 실행하세요.');
      process.exit(1);
    }
    const meta = JSON.parse(fs.readFileSync(outMeta, 'utf8'));
    const failed = meta.drawsFailed ?? [];
    if (failed.length === 0) {
      console.log('[sync-winning-stores] 보완할 실패 회차가 없습니다.');
      return;
    }
    console.log(`[sync-winning-stores] 실패 회차 ${failed.length}건 보완…`);
    const patches = [];
    const stillFailed = [];
    for (const drwNo of failed) {
      try {
        if (opts.delay > 0) await new Promise((r) => setTimeout(r, opts.delay));
        const rows = await fetchWinningRows(drwNo);
        patches.push({ drwNo, rows });
        appendCache(drwNo, rows);
        console.log(`  ✓ ${drwNo}회 (${rows.length}건)`);
      } catch (e) {
        stillFailed.push(drwNo);
        console.warn(`  ✗ ${drwNo}회:`, e.message ?? e);
      }
    }
    const stores = patchStoresFromDraws(loadExistingStores(), patches);
    const syncedAt = new Date().toISOString();
    fs.writeFileSync(outSlim, JSON.stringify(stores), 'utf8');
    fs.writeFileSync(
      outMeta,
      JSON.stringify(
        {
          ...meta,
          syncedAt,
          storeCount: stores.length,
          drawsFailed: stillFailed,
          dataNote: stillFailed.length
            ? `집계 시 ${stillFailed.length}개 회차 API 실패. npm run sync:stores:patch 로 재시도 가능.`
            : meta.dataNote,
        },
        null,
        2
      ),
      'utf8'
    );
    console.log(
      `[sync-winning-stores] 보완 완료: ${stores.length}곳, 남은 실패 ${stillFailed.length}회`
    );
    await runPostProcess();
    return;
  }

  const latest = await resolveLatestDrwNo(opts.to);
  const from = Math.max(DEFAULT_FROM, opts.from);
  const to = Math.min(latest, opts.to ?? latest);

  const cache = opts.resume ? await loadCache() : new Map();
  if (!opts.resume && fs.existsSync(cachePath)) {
    fs.unlinkSync(cachePath);
  }

  const failed = [];
  console.log(
    `[sync-winning-stores] ${from}~${to}회 (최신 ${latest}), 캐시 ${cache.size}회, delay ${opts.delay}ms`
  );

  for (let drwNo = from; drwNo <= to; drwNo++) {
    if (cache.has(drwNo)) continue;
    try {
      const rows = await fetchWinningRows(drwNo);
      cache.set(drwNo, rows);
      appendCache(drwNo, rows);
      if (drwNo % 50 === 0 || drwNo === to) {
        console.log(`  … ${drwNo}회 (${rows.length}건)`);
      }
    } catch (e) {
      failed.push(drwNo);
      console.warn(`  ⚠ ${drwNo}회 실패:`, e.message ?? e);
      await new Promise((r) => setTimeout(r, 3000));
    }
    if (opts.delay > 0 && drwNo < to) {
      await new Promise((r) => setTimeout(r, opts.delay));
    }
  }

  if (failed.length > 0) {
    console.log(`[sync-winning-stores] 실패 ${failed.length}회 재시도…`);
    const retryFailed = [];
    for (const drwNo of failed) {
      if (cache.has(drwNo)) continue;
      try {
        await new Promise((r) => setTimeout(r, 2500));
        const rows = await fetchWinningRows(drwNo);
        cache.set(drwNo, rows);
        appendCache(drwNo, rows);
        console.log(`  ✓ ${drwNo}회`);
      } catch (e) {
        retryFailed.push(drwNo);
        console.warn(`  ✗ ${drwNo}회:`, e.message ?? e);
      }
    }
    failed.length = 0;
    failed.push(...retryFailed);
  }

  const expected = to - from + 1;
  const inRange = [...cache.keys()].filter((n) => n >= from && n <= to).length;
  const existing = loadExistingStores();

  if (
    !opts.force &&
    existing.length > 500 &&
    inRange < expected * 0.85
  ) {
    console.error(
      `[sync-winning-stores] 캐시 ${inRange}/${expected}회만 있어 기존 JSON(${existing.length}곳)을 덮어쓰지 않습니다.`
    );
    console.error('  전체 재동기화: 캐시 삭제 후 npm run sync:stores');
    console.error('  강제 덮어쓰기: npm run sync:stores -- --force');
    process.exit(1);
  }

  const stores = aggregate(cache);
  const syncedAt = new Date().toISOString();
  const processed = inRange;

  fs.writeFileSync(outSlim, JSON.stringify(stores), 'utf8');
  fs.writeFileSync(
    outMeta,
    JSON.stringify(
      {
        source: 'dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do',
        syncedAt,
        fromDrwNo: from,
        toDrwNo: to,
        storeCount: stores.length,
        drawsProcessed: processed,
        drawsFailed: failed.length > 0 ? failed : undefined,
        dataNote:
          failed.length > 0
            ? `집계 시 ${failed.length}개 회차는 동행복권 API 응답 실패로 제외되었을 수 있습니다.`
            : undefined,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(
    `[sync-winning-stores] 완료: 명당 ${stores.length}곳, 캐시 ${cache.size}회, 실패 ${failed.length}회`
  );
  console.log(`  → ${outSlim}`);
  await runPostProcess();
}

async function runPostProcess() {
  const { spawnSync } = await import('node:child_process');
  const node = process.execPath;
  const root = path.resolve(__dirname, '..');
  for (const script of ['split-luck-stores-by-sido.mjs']) {
    const r = spawnSync(node, [path.join(__dirname, script)], {
      cwd: root,
      stdio: 'inherit',
    });
    if (r.status !== 0) {
      console.warn(`[sync-winning-stores] ${script} 실패 (status ${r.status})`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
