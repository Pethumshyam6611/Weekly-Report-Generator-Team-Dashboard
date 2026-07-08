'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CalendarDays, Clock, FileText, FolderKanban, Lock, Save, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { currentWeekRange } from '@/lib/utils/dateHelpers';
import { reportSchema, type ParsedReportFormValues, type ReportFormValues } from '@/lib/validators/report.schema';
import type { Project } from '@/lib/types/project.types';
import type { Report, ReportPayload } from '@/lib/types/report.types';

type ReportFormProps = {
  projects: Project[];
  initialReport?: Report | null;
  selectedProject?: Project | null;
  hideProjectSelect?: boolean;
  onSaveDraft: (payload: ReportPayload) => Promise<void>;
  onSubmitReport: (payload: ReportPayload) => Promise<void>;
  saving?: boolean;
};

const emptyToNull = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const toPayload = (values: ParsedReportFormValues): ReportPayload => ({
  projectId: Number(values.projectId),
  weekStart: values.weekStart,
  weekEnd: values.weekEnd,
  tasksCompleted: values.tasksCompleted,
  tasksPlanned: values.tasksPlanned,
  blockers: emptyToNull(values.blockers),
  hoursWorked: values.hoursWorked === '' || values.hoursWorked === undefined ? null : Number(values.hoursWorked),
  notes: emptyToNull(values.notes)
});

export function ReportForm({
  projects,
  initialReport,
  selectedProject,
  hideProjectSelect,
  onSaveDraft,
  onSubmitReport,
  saving
}: ReportFormProps) {
  const defaultWeek = currentWeekRange();
  const locked = Boolean(initialReport && initialReport.status !== 'draft');
  const activeProjects = projects.filter((project) => project.is_active);
  const projectForForm = selectedProject || initialReport?.project || activeProjects[0] || null;
  const defaultProjectId = initialReport?.project_id || projectForForm?.id || 0;
  const hasAssignedProjects = projects.length > 0;
  const hasActiveProjects = activeProjects.length > 0;
  const canUseProject = hideProjectSelect ? Boolean(projectForForm?.is_active) : hasActiveProjects;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReportFormValues, unknown, ParsedReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      projectId: defaultProjectId,
      weekStart: initialReport?.week_start || defaultWeek.weekStart,
      weekEnd: initialReport?.week_end || defaultWeek.weekEnd,
      tasksCompleted: initialReport?.tasks_completed || '',
      tasksPlanned: initialReport?.tasks_planned || '',
      blockers: initialReport?.blockers || '',
      hoursWorked: initialReport?.hours_worked ?? '',
      notes: initialReport?.notes || ''
    }
  });

  useEffect(() => {
    reset({
      projectId: defaultProjectId,
      weekStart: initialReport?.week_start || defaultWeek.weekStart,
      weekEnd: initialReport?.week_end || defaultWeek.weekEnd,
      tasksCompleted: initialReport?.tasks_completed || '',
      tasksPlanned: initialReport?.tasks_planned || '',
      blockers: initialReport?.blockers || '',
      hoursWorked: initialReport?.hours_worked ?? '',
      notes: initialReport?.notes || ''
    });
  }, [defaultProjectId, defaultWeek.weekEnd, defaultWeek.weekStart, initialReport, reset]);

  const saveDraft = handleSubmit((values) => onSaveDraft(toPayload(values)));
  const submitReport = handleSubmit((values) => onSubmitReport(toPayload(values)));

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-panel bg-brand-soft text-brand">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                {initialReport ? 'Edit draft report' : 'Weekly report details'}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                {projectForForm ? projectForForm.name : 'Choose an active project before filling the report.'}
              </p>
            </div>
          </div>
          {projectForForm ? (
            <Badge status={projectForForm.is_active ? 'active' : 'inactive'}>
              {projectForForm.is_active ? 'active project' : 'inactive project'}
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="space-y-6">
        {locked ? (
          <div className="flex items-start gap-2 rounded-panel border border-brand-border bg-brand-soft px-3 py-2 text-sm text-ink">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p>This report has been submitted and is read-only. Submitted reports are locked by the backend rule.</p>
          </div>
        ) : null}

        {!hasAssignedProjects ? (
          <div className="flex items-start gap-2 rounded-panel border border-status-pending/30 bg-status-pendingBg px-3 py-2 text-sm text-status-pending">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>You need at least one assigned project before you can create a report.</p>
          </div>
        ) : null}

        {hasAssignedProjects && !hasActiveProjects ? (
          <div className="flex items-start gap-2 rounded-panel border border-status-pending/30 bg-status-pendingBg px-3 py-2 text-sm text-status-pending">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Your assigned projects are inactive. Please contact a manager before creating a new report.</p>
          </div>
        ) : null}

        {hideProjectSelect && projectForForm && !projectForForm.is_active ? (
          <div className="flex items-start gap-2 rounded-panel border border-status-pending/30 bg-status-pendingBg px-3 py-2 text-sm text-status-pending">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>This project is inactive, so this report cannot be submitted until a manager reactivates it.</p>
          </div>
        ) : null}

        {hideProjectSelect ? <input type="hidden" {...register('projectId')} /> : null}

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Week start"
                type="date"
                disabled={locked}
                error={errors.weekStart?.message}
                {...register('weekStart')}
              />
              <Input
                label="Week end"
                type="date"
                disabled={locked}
                error={errors.weekEnd?.message}
                {...register('weekEnd')}
              />
            </div>

            {!hideProjectSelect ? (
              <Select
                label="Project"
                disabled={locked || !hasActiveProjects}
                error={errors.projectId?.message}
                {...register('projectId')}
              >
                <option value="">Choose an active project</option>
                {activeProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            ) : null}

            <div className="space-y-4 rounded-panel border border-line bg-surface-page p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FolderKanban className="h-4 w-4 text-brand" />
                Work summary
              </div>
              <Textarea
                label="Tasks completed"
                disabled={locked}
                error={errors.tasksCompleted?.message}
                className="min-h-36 bg-white"
                {...register('tasksCompleted')}
              />
              <Textarea
                label="Tasks planned for next week"
                disabled={locked}
                error={errors.tasksPlanned?.message}
                className="min-h-32 bg-white"
                {...register('tasksPlanned')}
              />
            </div>

            <div className="space-y-4 rounded-panel border border-line bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <AlertCircle className="h-4 w-4 text-status-pending" />
                Risks and notes
              </div>
              <Textarea
                label="Blockers or challenges"
                disabled={locked}
                className="min-h-24"
                {...register('blockers')}
              />
              <Textarea label="Notes or links" disabled={locked} className="min-h-24" {...register('notes')} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-panel border border-line bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="h-4 w-4 text-brand" />
                Time worked
              </div>
              <Input
                label="Hours worked"
                type="number"
                step="0.5"
                min="0"
                disabled={locked}
                error={errors.hoursWorked?.message}
                className="mt-3"
                {...register('hoursWorked')}
              />
            </div>

            <div className="rounded-panel border border-line bg-surface-page p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CalendarDays className="h-4 w-4 text-brand" />
                Report state
              </div>
              <div className="mt-3 space-y-2 text-sm text-ink-muted">
                <p>Drafts can be updated until you submit them.</p>
                <p>Submitted reports become read-only for manager review.</p>
              </div>
            </div>
          </aside>
        </div>

        {!locked ? (
          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              isLoading={saving || isSubmitting}
              disabled={!canUseProject}
            >
              <Save className="h-4 w-4" />
              Save as draft
            </Button>
            <Button
              type="button"
              onClick={submitReport}
              isLoading={saving || isSubmitting}
              disabled={!canUseProject}
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
