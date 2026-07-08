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
import type { SubmissionMemberStatus } from '@/lib/types/dashboard.types';

const toChartData = (members: SubmissionMemberStatus[]) => {
  return members.map((member) => ({
    name: member.name,
    submitted: member.projects.filter((project) => project.status === 'submitted').length,
    pending: member.projects.filter((project) => project.status === 'pending').length,
    late: member.projects.filter((project) => project.status === 'late').length
  }));
};

export function SubmissionStatusChart({ members }: { members: SubmissionMemberStatus[] }) {
  const chartData = toChartData(members);
  const hasData = chartData.some((member) => member.submitted + member.pending + member.late > 0);
  const chartHeight = Math.max(288, chartData.length * 48);

  return (
    <ChartCard
      title="Submission status by team member"
      description="Submitted, pending, and late project reports for the selected week."
    >
      {!hasData ? (
        <ChartEmptyState message="No assigned project status is available for this week." />
      ) : (
        <>
          <ChartLegend
            items={[
              { label: 'Submitted', color: chartColors.submitted },
              { label: 'Pending', color: chartColors.pending },
              { label: 'Late', color: chartColors.late }
            ]}
          />
          <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              barCategoryGap={16}
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
                dataKey="name"
                width={112}
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }} />
              <Bar dataKey="submitted" name="Submitted" stackId="status" fill={chartColors.submitted} radius={[6, 0, 0, 6]} />
              <Bar dataKey="pending" name="Pending" stackId="status" fill={chartColors.pending} />
              <Bar dataKey="late" name="Late" stackId="status" fill={chartColors.late} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </>
      )}
    </ChartCard>
  );
}
