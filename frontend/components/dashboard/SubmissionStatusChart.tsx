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
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Submission status by team member</h2>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={toChartData(members)} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#E5E3EC" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6B6B76', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="submitted" stackId="status" fill="#18794E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" stackId="status" fill="#D99A00" />
              <Bar dataKey="late" stackId="status" fill="#B42318" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
