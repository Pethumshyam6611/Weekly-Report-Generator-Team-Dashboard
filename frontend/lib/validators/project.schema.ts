import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional()
});

export const assignMembersSchema = z.object({
  userIds: z.array(z.number().int().positive()).min(1, 'Select at least one team member')
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
