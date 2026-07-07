'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ReportForm } from '@/components/reports/ReportForm';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { getProjects } from '@/lib/api/projects.api';
import { getReport, submitReport, updateReport } from '@/lib/api/reports.api';
import type { Project } from '@/lib/types/project.types';
import type { Report, ReportPayload } from '@/lib/types/report.types';

export default function ReportDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const reportId = Number(params.id);
  const [report, setReport] = useState<Report | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getReport(reportId), getProjects()])
      .then(([nextReport, nextProjects]) => {
        setReport(nextReport);
        setProjects(nextProjects);
      })
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load report')))
      .finally(() => setLoading(false));
  }, [reportId]);

  const saveDraft = async (payload: ReportPayload) => {
    setSaving(true);
    try {
      const updated = await updateReport(reportId, payload);
      setReport(updated);
      toast.success('Draft updated');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not update report'));
    } finally {
      setSaving(false);
    }
  };

  const updateAndSubmit = async (payload: ReportPayload) => {
    setSaving(true);
    try {
      await updateReport(reportId, payload);
      await submitReport(reportId);
      toast.success('Report submitted');
      router.push('/reports');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not submit report'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading report" />;
  }

  if (!report) {
    return <p className="text-sm text-ink-muted">Report not found.</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">Weekly report</h2>
        <p className="section-subtitle">Review details, update the draft, or submit when ready.</p>
      </div>
      <ReportForm
        projects={projects}
        initialReport={report}
        onSaveDraft={saveDraft}
        onSubmitReport={updateAndSubmit}
        saving={saving}
      />
    </div>
  );
}
