'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ChartCard, ChartEmptyState, ChartTooltip, chartColors } from './ChartChrome';
import type { TasksTrendPoint } from '@/lib/types/dashboard.types';
import { formatDate } from '@/lib/utils/dateHelpers';
import { formatHours } from '@/lib/utils/formatters';

const compactDate = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
};

export function TasksTrendChart({ data }: { data: TasksTrendPoint[] }) {
  const hasData = data.some((item) => item.reportCount > 0 || item.totalHours > 0);

  return (
    <ChartCard
      title="Reporting trend"
      description="Weekly report volume and hours logged over time."
    >
      {!hasData ? (
        <ChartEmptyState message="Trend data appears after team members submit reports." />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="weekStart"
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickFormatter={compactDate}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="reports"
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="hours"
                orientation="right"
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    labelFormatter={formatDate}
                    valueFormatter={(value, name) => (name === 'Hours' ? formatHours(Number(value)) : String(value))}
                  />
                }
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ color: chartColors.axis, fontSize: 12, paddingBottom: 12 }}
              />
              <Line
                yAxisId="reports"
                type="monotone"
                dataKey="reportCount"
                name="Reports"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: 'rgb(var(--color-surface-panel))' }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="hours"
                type="monotone"
                dataKey="totalHours"
                name="Hours"
                stroke={chartColors.secondary}
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2, fill: 'rgb(var(--color-surface-panel))' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
