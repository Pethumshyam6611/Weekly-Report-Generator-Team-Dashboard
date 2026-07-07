'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { ProjectWithMembers } from '@/lib/types/project.types';
import type { User } from '@/lib/types/user.types';

type AssignMemberModalProps = {
  open: boolean;
  project: ProjectWithMembers | null;
  members: User[];
  saving?: boolean;
  onClose: () => void;
  onAssign: (userIds: number[]) => Promise<void>;
};

export function AssignMemberModal({ open, project, members, saving, onClose, onAssign }: AssignMemberModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((member) => (
      member.name.toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle)
    ));
  }, [members, search]);

  const assignedIds = new Set(project?.members?.map((member) => member.id) || []);

  const toggle = (id: number) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const submit = async () => {
    await onAssign(selectedIds);
    setSelectedIds([]);
    setSearch('');
  };

  return (
    <Modal
      open={open}
      title="Assign members"
      description={project ? `Assign team members to ${project.name}.` : undefined}
      onClose={onClose}
    >
      <div className="space-y-4">
        <Input label="Search members" value={search} onChange={(event) => setSearch(event.target.value)} />

        {filteredMembers.length === 0 ? (
          <EmptyState
            title="No team members found"
            description="Team members appear here after they have reports or existing project assignments."
          />
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {filteredMembers.map((member) => {
              const alreadyAssigned = assignedIds.has(member.id);
              return (
                <label
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-panel border border-line px-3 py-2 text-sm"
                >
                  <span>
                    <span className="block font-medium text-ink">{member.name}</span>
                    <span className="text-xs text-ink-muted">{member.email}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand"
                    checked={selectedIds.includes(member.id) || alreadyAssigned}
                    disabled={alreadyAssigned}
                    onChange={() => toggle(member.id)}
                  />
                </label>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" isLoading={saving} disabled={selectedIds.length === 0} onClick={submit}>
            Assign selected
          </Button>
        </div>
      </div>
    </Modal>
  );
}
