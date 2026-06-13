import type { DhLotteryDrawJson } from '@/lib/lotto/dhlottery-types';
import { formatKoreanAmount, formatKRW } from '@/lib/core/format/currency';
import { formatYmdKorean } from '@/lib/lotto/draw-format';

export function drawPageTitle(draw: DhLotteryDrawJson): string {
  const nums = draw.numbers;
  const numPart =
    nums && nums.length === 6
      ? ` ${[...nums].sort((a, b) => a - b).join(',')}${draw.bonus != null ? `+${draw.bonus}` : ''}`
      : '';
  return `로또 ${draw.drwNo}회 당첨번호${numPart}`;
}

export function drawPageDescription(draw: DhLotteryDrawJson): string {
  const date = formatYmdKorean(draw.drwNoDate);
  const prize = formatKoreanAmount(draw.firstWinamnt);
  const winners =
    draw.firstWinnerCount !== undefined
      ? ` 1등 ${draw.firstWinnerCount.toLocaleString('ko-KR')}명,`
      : '';
  return `${date} 추첨 로또 ${draw.drwNo}회 1등 당첨번호·보너스 확인.${winners} 1인당 ${prize} (${formatKRW(draw.firstWinamnt)}).`;
}
