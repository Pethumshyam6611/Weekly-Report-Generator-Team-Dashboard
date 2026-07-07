'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { TasksTrendPoint } from '@/lib/types/dashboard.types';

export function TasksTrendChart({ data }: { data: TasksTrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Tasks completed over time</h2>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#E5E3EC" vertical={false} />
              <XAxis dataKey="weekStart" tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reportCount"
                name="Reports"
                stroke="#5B3FA6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="totalHours"
                name="Hours"
                stroke="#8B8796"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
