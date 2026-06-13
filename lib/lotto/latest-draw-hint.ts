import fs from 'node:fs';
import path from 'node:path';
import { loadLatestDrawSnapshot } from '@/lib/lotto/latest-draw-snapshot';
import { estimateMaxDrwNo } from '@/lib/lotto/upstream-lt645';

const metaPath = path.join(process.cwd(), 'data', 'stores', 'luck-stores.meta.json');

/** Git 스냅샷·명당 meta — API 없이 최신 회차 (빌드·Vercel용) */
export function getLatestDrwNoFromDisk(): number {
  const snap = loadLatestDrawSnapshot();
  if (snap?.drwNo) return snap.drwNo;

  try {
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as { toDrwNo?: number };
      if (typeof meta.toDrwNo === 'number' && meta.toDrwNo > 0) {
        return meta.toDrwNo + 1;
      }
    }
  } catch {
    /* ignore */
  }
  return estimateMaxDrwNo();
}

/** API 역순 조회 시작 회차 */
export function getLatestDrawHintDrwNo(): number {
  return getLatestDrwNoFromDisk();
}
