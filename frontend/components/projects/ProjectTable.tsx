import { Edit3, UserPlus, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, Td, Th } from '@/components/ui/Table';
import type { ProjectWithMembers } from '@/lib/types/project.types';

type ProjectTableProps = {
  projects: ProjectWithMembers[];
  onEdit: (project: ProjectWithMembers) => void;
  onAssign: (project: ProjectWithMembers) => void;
  onDeactivate: (project: ProjectWithMembers) => void;
};

export function ProjectTable({ projects, onEdit, onAssign, onDeactivate }: ProjectTableProps) {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Members</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className={project.is_active ? undefined : 'bg-surface-page/70'}>
              <Td className="font-medium">
                <p>{project.name}</p>
                {!project.is_active ? (
                  <p className="mt-1 text-xs font-normal text-ink-faint">Kept for report history</p>
                ) : null}
              </Td>
              <Td className="max-w-md text-ink-muted">{project.description || 'No description'}</Td>
              <Td>
                <Badge status={project.is_active ? 'active' : 'inactive'}>
                  {project.is_active ? 'active' : 'inactive'}
                </Badge>
              </Td>
              <Td>{project.memberCount ?? project.members?.length ?? 0}</Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!project.is_active}
                    onClick={() => onEdit(project)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!project.is_active}
                    onClick={() => onAssign(project)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!project.is_active}
                    onClick={() => onDeactivate(project)}
                  >
                    <XCircle className="h-4 w-4" />
                    Deactivate
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
