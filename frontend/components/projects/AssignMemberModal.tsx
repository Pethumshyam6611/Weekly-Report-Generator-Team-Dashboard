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
  onUnassign: (userId: number) => Promise<void>;
};

export function AssignMemberModal({ open, project, members, saving, onClose, onAssign, onUnassign }: AssignMemberModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const assignedMembers = project?.members || [];
  const assignedIds = useMemo(() => new Set(assignedMembers.map((member) => member.id)), [assignedMembers]);

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const availableMembers = members.filter((member) => !assignedIds.has(member.id));
    if (!needle) return availableMembers;
    return availableMembers.filter((member) => (
      member.name.toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle)
    ));
  }, [assignedIds, members, search]);

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

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">Assigned members</h3>
            <span className="text-xs text-ink-muted">{assignedMembers.length} assigned</span>
          </div>
          {assignedMembers.length === 0 ? (
            <div className="rounded-panel border border-dashed border-line bg-surface-page px-4 py-3 text-sm text-ink-muted">
              No members are assigned to this project yet.
            </div>
          ) : (
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {assignedMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-panel border border-line bg-surface-page px-3 py-2 text-sm">
                  <span>
                    <span className="block font-medium text-ink">{member.name}</span>
                    <span className="text-xs text-ink-muted">{member.email}</span>
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={saving}
                    onClick={() => onUnassign(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {filteredMembers.length === 0 ? (
          <EmptyState
            title="No available members found"
            description="All matching team members are already assigned to this project."
          />
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {filteredMembers.map((member) => {
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
                    checked={selectedIds.includes(member.id)}
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
