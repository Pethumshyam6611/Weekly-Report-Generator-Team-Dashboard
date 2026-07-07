import { z } from 'zod';

export const reportSchema = z.object({
  projectId: z.coerce.number().int().positive('Choose a project'),
  weekStart: z.string().min(1, 'Week start is required'),
  weekEnd: z.string().min(1, 'Week end is required'),
  tasksCompleted: z.string().min(1, 'Tasks completed is required'),
  tasksPlanned: z.string().min(1, 'Tasks planned is required'),
  blockers: z.string().optional(),
  hoursWorked: z.union([z.coerce.number().min(0, 'Hours cannot be negative'), z.literal('')]).optional(),
  notes: z.string().optional()
}).refine((data) => new Date(data.weekStart) <= new Date(data.weekEnd), {
  message: 'Week start must be before week end',
  path: ['weekEnd']
});

export type ReportFormValues = z.input<typeof reportSchema>;
export type ParsedReportFormValues = z.output<typeof reportSchema>;
