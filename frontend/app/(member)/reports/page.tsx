'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ReportHistoryList } from '@/components/reports/ReportHistoryList';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { getMyReports } from '@/lib/api/reports.api';
import type { MyReportsResponse } from '@/lib/types/report.types';

export default function ReportsPage() {
  const router = useRouter();
  const [data, setData] = useState<MyReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports({ perPage: 50 })
      .then(setData)
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load reports')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner label="Loading report history" />;
  }

  const weeks = data?.weeks || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="section-title">Report history</h2>
          <p className="section-subtitle">Most recent weekly reports appear first.</p>
        </div>
        <Button type="button" onClick={() => router.push('/reports/new')}>
          <Plus className="h-4 w-4" />
          New report
        </Button>
      </div>

      {weeks.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Create your first weekly report once you have an assigned project."
          actionLabel="Create report"
          onAction={() => router.push('/reports/new')}
        />
      ) : (
        <ReportHistoryList weeks={weeks} />
      )}
    </div>
  );
}
