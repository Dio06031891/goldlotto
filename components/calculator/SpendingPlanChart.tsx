'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { segmentsWithPercent } from '@/lib/core/spending/plan-math';
import type { ChartSegment } from '@/lib/core/spending/plan-math';
import { formatKoreanAmount, formatKRW } from '@/lib/core/format/currency';

type Props = {
  segments: ChartSegment[];
  /** % 계산 기준 (세후 총당첨금) */
  baseTotal: number;
};

function formatPercentOneDecimal(value: number): string {
  return `${value.toFixed(1)}%`;
}

function renderPercentLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
  payload,
}: PieLabelRenderProps) {
  const payloadPct =
    payload && typeof payload === 'object' && 'percent' in payload
      ? Number((payload as { percent?: number }).percent)
      : (percent ?? 0) * 100;

  if (!Number.isFinite(payloadPct) || payloadPct < 4) return null;

  const RADIAN = Math.PI / 180;
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.55;
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={800}
      stroke="#0f172a"
      strokeWidth={0.75}
      paintOrder="stroke"
    >
      {formatPercentOneDecimal(payloadPct)}
    </text>
  );
}

export function SpendingPlanChart({ segments, baseTotal }: Props) {
  if (segments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">
        사용 금액을 입력하면 비율 차트가 표시됩니다.
      </p>
    );
  }

  const withPercent = segmentsWithPercent(segments, baseTotal);

  const data = withPercent.map((s) => ({
    name: s.label,
    value: s.amount,
    fill: s.color,
    percent: s.percent,
  }));

  return (
    <div className="w-full" aria-hidden={false}>
      <div className="h-56 w-full sm:h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="78%"
            paddingAngle={2}
            label={renderPercentLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, item) => {
              const n = typeof value === 'number' ? value : Number(value ?? 0);
              const pct =
                item && typeof item === 'object' && 'payload' in item
                  ? (item as { payload?: { percent?: number } }).payload?.percent
                  : undefined;
              const pctLabel =
                pct !== undefined ? ` (${pct.toFixed(1)}%)` : '';
              return [`${formatKRW(n)}${pctLabel}`, '금액'];
            }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
      <ul className="-mt-1 mb-5 flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-sm text-muted">
        {withPercent.map((s) => (
          <li key={s.category} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-semibold text-ink">{s.label}</span>
            <span className="tabular-nums">
              {formatKoreanAmount(s.amount)}
              <span className="ml-1.5 font-bold text-brand">
                {formatPercentOneDecimal(s.percent)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
