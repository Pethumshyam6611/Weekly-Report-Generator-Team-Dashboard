'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
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

export function ReportForm({ projects, initialReport, onSaveDraft, onSubmitReport, saving }: ReportFormProps) {
  const defaultWeek = currentWeekRange();
  const locked = Boolean(initialReport && initialReport.status !== 'draft');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReportFormValues, unknown, ParsedReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      projectId: initialReport?.project_id || projects[0]?.id || 0,
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
      projectId: initialReport?.project_id || projects[0]?.id || 0,
      weekStart: initialReport?.week_start || defaultWeek.weekStart,
      weekEnd: initialReport?.week_end || defaultWeek.weekEnd,
      tasksCompleted: initialReport?.tasks_completed || '',
      tasksPlanned: initialReport?.tasks_planned || '',
      blockers: initialReport?.blockers || '',
      hoursWorked: initialReport?.hours_worked ?? '',
      notes: initialReport?.notes || ''
    });
  }, [defaultWeek.weekEnd, defaultWeek.weekStart, initialReport, projects, reset]);

  const saveDraft = handleSubmit((values) => onSaveDraft(toPayload(values)));
  const submitReport = handleSubmit((values) => onSubmitReport(toPayload(values)));

  return (
    <Card>
      <CardContent className="space-y-5">
        {locked ? (
          <div className="flex items-start gap-2 rounded-panel border border-brand-border bg-brand-soft px-3 py-2 text-sm text-ink">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p>This report has been submitted and is read-only. Submitted reports are locked by the backend rule.</p>
          </div>
        ) : null}

        {projects.length === 0 ? (
          <div className="flex items-start gap-2 rounded-panel border border-status-pending/30 bg-status-pendingBg px-3 py-2 text-sm text-status-pending">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>You need at least one assigned project before you can create a report.</p>
          </div>
        ) : null}

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

        <Select
          label="Project"
          disabled={locked || projects.length === 0}
          error={errors.projectId?.message}
          {...register('projectId')}
        >
          <option value="">Choose a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>

        <Textarea
          label="Tasks completed"
          disabled={locked}
          error={errors.tasksCompleted?.message}
          {...register('tasksCompleted')}
        />
        <Textarea
          label="Tasks planned for next week"
          disabled={locked}
          error={errors.tasksPlanned?.message}
          {...register('tasksPlanned')}
        />
        <Textarea label="Blockers or challenges" disabled={locked} {...register('blockers')} />
        <Input
          label="Hours worked"
          type="number"
          step="0.5"
          min="0"
          disabled={locked}
          error={errors.hoursWorked?.message}
          {...register('hoursWorked')}
        />
        <Textarea label="Notes or links" disabled={locked} {...register('notes')} />

        {!locked ? (
          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              isLoading={saving || isSubmitting}
              disabled={projects.length === 0}
            >
              Save as draft
            </Button>
            <Button
              type="button"
              onClick={submitReport}
              isLoading={saving || isSubmitting}
              disabled={projects.length === 0}
            >
              Submit
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
