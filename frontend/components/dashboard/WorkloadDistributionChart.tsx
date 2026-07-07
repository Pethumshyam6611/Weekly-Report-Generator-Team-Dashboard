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
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { WorkloadDistributionPoint } from '@/lib/types/dashboard.types';

export function WorkloadDistributionChart({ data }: { data: WorkloadDistributionPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Workload distribution by project</h2>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#E5E3EC" vertical={false} />
              <XAxis dataKey="projectName" tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="reportCount" name="Reports" fill="#5B3FA6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalHours" name="Hours" fill="#8B8796" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
