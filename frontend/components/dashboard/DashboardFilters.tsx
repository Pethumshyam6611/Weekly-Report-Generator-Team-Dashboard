'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Project } from '@/lib/types/project.types';

type DashboardFiltersProps = {
  week: string;
  projectId: string;
  projects: Project[];
  onWeekChange: (week: string) => void;
  onProjectChange: (projectId: string) => void;
};

export function DashboardFilters({ week, projectId, projects, onWeekChange, onProjectChange }: DashboardFiltersProps) {
  return (
    <div className="grid gap-3 rounded-panel border border-line bg-white p-3 sm:grid-cols-2 lg:max-w-xl">
      <Input label="Week" type="date" value={week} onChange={(event) => onWeekChange(event.target.value)} />
      <Select label="Project" value={projectId} onChange={(event) => onProjectChange(event.target.value)}>
        <option value="">All projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
