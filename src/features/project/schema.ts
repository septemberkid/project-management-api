import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().max(150).optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  client_id: z.string().trim().min(1, 'Client is required'),
});
export const updateProjectSchema = createProjectSchema;
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;

export const queryProjectSchema = z.object({
  name: z.string().optional(),
  client_id: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  sort_by: z.string().optional(),
  sort_dir: z.string().optional(),
});
export type QueryProjectSchema = z.infer<typeof queryProjectSchema>;
