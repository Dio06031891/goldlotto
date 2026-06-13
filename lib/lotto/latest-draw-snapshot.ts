import fs from 'node:fs';
import path from 'node:path';
import { parseDhLotteryDraw, type DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';

const snapshotPath = path.join(process.cwd(), 'data', 'lotto', 'latest-draw.snapshot.json');

/** Vercel 등에서 동행복권 API 실패 시 Git에 포함된 최신 회차 백업 */
export function loadLatestDrawSnapshot(): DhLotteryDrawJson | null {
  try {
    if (!fs.existsSync(snapshotPath)) return null;
    const raw = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) as Record<string, unknown>;
    const { snapshotAt: _s, ...drawFields } = raw;
    return parseDhLotteryDraw({ ...drawFields, returnValue: 'success' });
  } catch {
    return null;
  }
}
