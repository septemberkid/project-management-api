import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().email({
      message: 'Invalid email address',
    }),
  ),
  base_role: z.string().trim().min(1, 'Base role is required').max(10),
});
export const updateMemberSchema = createMemberSchema;
export type CreateMemberSchema = z.infer<typeof createMemberSchema>;
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;

export const queryMemberSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  base_role: z.string().optional(),
  trashed: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  sort_by: z.string().optional(),
  sort_dir: z.string().optional(),
});
export type QueryMemberSchema = z.infer<typeof queryMemberSchema>;
