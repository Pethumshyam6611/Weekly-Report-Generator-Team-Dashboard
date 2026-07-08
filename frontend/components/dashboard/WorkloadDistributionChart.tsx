'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ChartCard, ChartEmptyState, ChartLegend, ChartTooltip, chartColors } from './ChartChrome';
import type { WorkloadDistributionPoint } from '@/lib/types/dashboard.types';
import { formatHours } from '@/lib/utils/formatters';

export function WorkloadDistributionChart({ data }: { data: WorkloadDistributionPoint[] }) {
  const hasData = data.some((project) => project.reportCount > 0 || project.totalHours > 0);
  const chartHeight = Math.max(288, data.length * 56);

  return (
    <ChartCard
      title="Workload distribution by project"
      description="Report count and logged hours grouped by project."
    >
      {!hasData ? (
        <ChartEmptyState message="No workload data matches the selected week or project filter." />
      ) : (
        <>
          <ChartLegend
            items={[
              { label: 'Reports', color: chartColors.primary },
              { label: 'Hours', color: chartColors.secondary }
            ]}
          />
          <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              barCategoryGap={14}
              margin={{ top: 4, right: 12, bottom: 0, left: 12 }}
            >
              <CartesianGrid stroke={chartColors.grid} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="projectName"
                width={136}
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    valueFormatter={(value, name) => (name === 'Hours' ? formatHours(Number(value)) : String(value))}
                  />
                }
                cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }}
              />
              <Bar dataKey="reportCount" name="Reports" fill={chartColors.primary} radius={[0, 6, 6, 0]} />
              <Bar dataKey="totalHours" name="Hours" fill={chartColors.secondary} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </>
      )}
    </ChartCard>
  );
}
