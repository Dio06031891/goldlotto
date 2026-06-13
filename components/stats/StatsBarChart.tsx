'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Point = { label: string; count: number };

type Props = {
  data: Point[];
  xKey?: 'label';
  barName?: string;
  color?: string;
};

export function StatsBarChart({
  data,
  barName = '횟수',
  color = '#2563eb',
}: Props) {
  const chartData = data.map((d) => ({ label: d.label, count: d.count }));

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={48} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
          <Tooltip
            formatter={(value) => [`${value}회`, barName]}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} name={barName} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
