'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { projectSchema, type ProjectFormValues } from '@/lib/validators/project.schema';
import type { Project } from '@/lib/types/project.types';

type ProjectFormModalProps = {
  open: boolean;
  project?: Project | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
};

export function ProjectFormModal({ open, project, saving, onClose, onSubmit }: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  useEffect(() => {
    reset({
      name: project?.name || '',
      description: project?.description || ''
    });
  }, [project, reset, open]);

  return (
    <Modal
      open={open}
      title={project ? 'Edit project' : 'Add project'}
      description="Projects organize weekly reports and dashboard workload."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} />
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving || isSubmitting}>
            Save project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
