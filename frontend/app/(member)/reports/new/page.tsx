'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProjectReportPicker } from '@/components/reports/ProjectReportPicker';
import { ReportForm } from '@/components/reports/ReportForm';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import { getProjects } from '@/lib/api/projects.api';
import { createReport, submitReport } from '@/lib/api/reports.api';
import type { Project } from '@/lib/types/project.types';
import type { ReportPayload } from '@/lib/types/report.types';

export default function NewReportPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((error) => toast.error(getApiErrorMessage(error, 'Could not load projects')))
      .finally(() => setLoading(false));
  }, []);

  const saveDraft = async (payload: ReportPayload) => {
    setSaving(true);
    try {
      const report = await createReport(payload);
      toast.success('Draft saved');
      router.push(`/reports/${report.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not save draft'));
    } finally {
      setSaving(false);
    }
  };

  const createAndSubmit = async (payload: ReportPayload) => {
    setSaving(true);
    try {
      const report = await createReport(payload);
      await submitReport(report.id);
      toast.success('Report submitted');
      router.push('/reports');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not submit report'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading report form" />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="section-title">New weekly report</h2>
        <p className="section-subtitle">Save a draft or submit it for manager review.</p>
      </div>

      <ProjectReportPicker
        projects={projects}
        selectedProjectId={selectedProject?.id}
        onSelect={(project) => setSelectedProject(project)}
      />

      {selectedProject ? (
        <ReportForm
          projects={projects}
          selectedProject={selectedProject}
          hideProjectSelect
          onSaveDraft={saveDraft}
          onSubmitReport={createAndSubmit}
          saving={saving}
        />
      ) : (
        <div className="rounded-panel border border-dashed border-line bg-white px-4 py-8 text-center">
          <p className="text-sm font-medium text-ink">Choose an active project to continue</p>
          <p className="mt-1 text-sm text-ink-muted">The report form will open after selecting a project.</p>
        </div>
      )}
    </div>
  );
}
