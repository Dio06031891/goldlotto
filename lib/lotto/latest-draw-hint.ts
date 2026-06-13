import fs from 'node:fs';
import path from 'node:path';
import { estimateMaxDrwNo } from '@/lib/lotto/upstream-lt645';

const metaPath = path.join(process.cwd(), 'data', 'stores', 'luck-stores.meta.json');

/** API 역순 조회 시작 회차 — 명당 meta·추정치 중 큰 값 */
export function getLatestDrawHintDrwNo(): number {
  try {
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as { toDrwNo?: number };
      if (typeof meta.toDrwNo === 'number' && meta.toDrwNo > 0) {
        return Math.max(meta.toDrwNo + 2, estimateMaxDrwNo());
      }
    }
  } catch {
    /* ignore */
  }
  return estimateMaxDrwNo();
}
