'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AssignMemberModal } from '@/components/projects/AssignMemberModal';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { getApiErrorMessage } from '@/lib/api/axiosClient';
import {
  assignUserToProject,
  createProject,
  deactivateProject,
  getProjectMembers,
  getProjects,
  unassignUserFromProject,
  updateProject
} from '@/lib/api/projects.api';
import { getTeamMembers } from '@/lib/api/users.api';
import type { ProjectWithMembers } from '@/lib/types/project.types';
import type { User } from '@/lib/types/user.types';
import type { ProjectFormValues } from '@/lib/validators/project.schema';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithMembers[]>([]);
  const [knownMembers, setKnownMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithMembers | null>(null);
  const [assigningProject, setAssigningProject] = useState<ProjectWithMembers | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [nextProjects, teamMembers] = await Promise.all([
        getProjects(),
        getTeamMembers()
      ]);

      const projectsWithMembers = await Promise.all(
        nextProjects.map(async (project) => {
          try {
            const members = await getProjectMembers(project.id);
            return { ...project, members, memberCount: members.length };
          } catch {
            return { ...project, members: [], memberCount: 0 };
          }
        })
      );

      setProjects(projectsWithMembers);
      setKnownMembers(teamMembers);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not load projects'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sortedProjects = useMemo(() => (
    [...projects].sort((a, b) => a.name.localeCompare(b.name))
  ), [projects]);

  const saveProject = async (values: ProjectFormValues) => {
    setSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, values);
        toast.success('Project updated');
      } else {
        await createProject(values);
        toast.success('Project created');
      }
      setProjectModalOpen(false);
      setEditingProject(null);
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not save project'));
    } finally {
      setSaving(false);
    }
  };

  const assignMembers = async (userIds: number[]) => {
    if (!assigningProject) return;
    setSaving(true);
    try {
      await Promise.all(userIds.map((userId) => assignUserToProject(assigningProject.id, userId)));
      toast.success('Members assigned');
      setAssigningProject(null);
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not assign members'));
    } finally {
      setSaving(false);
    }
  };

  const unassignMember = async (userId: number) => {
    if (!assigningProject) return;
    setSaving(true);
    try {
      await unassignUserFromProject(assigningProject.id, userId);
      toast.success('Member removed from project');
      await load();
      const members = await getProjectMembers(assigningProject.id);
      setAssigningProject((current) => (current ? { ...current, members, memberCount: members.length } : current));
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not remove member'));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (project: ProjectWithMembers) => {
    setSaving(true);
    try {
      await deactivateProject(project.id);
      toast.success('Project deactivated');
      await load();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not deactivate project'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading projects" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Create projects and manage team member assignment.</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setProjectModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add project
        </Button>
      </div>

      {sortedProjects.length === 0 ? (
        <EmptyState title="No projects yet" description="Add the first project before team members submit reports." />
      ) : (
        <ProjectTable
          projects={sortedProjects}
          onEdit={(project) => {
            setEditingProject(project);
            setProjectModalOpen(true);
          }}
          onAssign={setAssigningProject}
          onDeactivate={deactivate}
        />
      )}

      <ProjectFormModal
        open={projectModalOpen}
        project={editingProject}
        saving={saving}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={saveProject}
      />

      <AssignMemberModal
        open={Boolean(assigningProject)}
        project={assigningProject}
        members={knownMembers}
        saving={saving}
        onClose={() => setAssigningProject(null)}
        onAssign={assignMembers}
        onUnassign={unassignMember}
      />
    </div>
  );
}
