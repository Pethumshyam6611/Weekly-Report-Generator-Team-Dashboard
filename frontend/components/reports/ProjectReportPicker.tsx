'use client';

import { CheckCircle2, FolderKanban, LockKeyhole, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import type { Project } from '@/lib/types/project.types';

type ProjectReportPickerProps = {
  projects: Project[];
  selectedProjectId?: number | null;
  onSelect: (project: Project) => void;
};

export function ProjectReportPicker({ projects, selectedProjectId, onSelect }: ProjectReportPickerProps) {
  const activeCount = projects.filter((project) => project.is_active).length;

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink">Assigned projects</h3>
          <p className="text-sm text-ink-muted">Select an active project to start this week's report.</p>
        </div>
        <p className="text-sm text-ink-muted">{activeCount} active of {projects.length}</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-panel border border-dashed border-line bg-white px-4 py-6 text-center">
          <FolderKanban className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-2 text-sm font-medium text-ink">No assigned projects</p>
          <p className="mt-1 text-sm text-ink-muted">Ask a manager to assign a project before creating reports.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const selected = selectedProjectId === project.id;
            const disabled = !project.is_active;

            return (
              <button
                key={project.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(project)}
                className={cn(
                  'min-h-28 rounded-panel border bg-white p-4 text-left shadow-subtle transition focus:outline-none focus:ring-2 focus:ring-brand/25',
                  selected ? 'border-brand-border bg-brand-soft' : 'border-line hover:border-brand-border hover:bg-surface-subtle',
                  disabled && 'cursor-not-allowed border-line bg-surface-page opacity-75 hover:border-line hover:bg-surface-page'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-panel',
                        disabled ? 'bg-status-draftBg text-status-draft' : 'bg-status-submittedBg text-status-submitted'
                      )}
                    >
                      {disabled ? <LockKeyhole className="h-5 w-5" /> : <FolderKanban className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className={cn('truncate text-sm font-semibold', disabled ? 'text-ink-muted' : 'text-ink')}>
                        {project.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                        {project.description || (disabled ? 'Inactive project' : 'Ready for weekly reporting')}
                      </p>
                    </div>
                  </div>
                  <Badge status={project.is_active ? 'active' : 'inactive'}>
                    {project.is_active ? 'active' : 'inactive'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                  {disabled ? (
                    <span className="text-ink-muted">Unavailable for new reports</span>
                  ) : selected ? (
                    <span className="inline-flex items-center gap-1 text-brand">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-status-submitted">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Create report
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
