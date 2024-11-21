import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  address: z.string().max(255).optional(),
  email: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .email({
        message: 'Invalid email address',
      })
      .optional(),
  ),
  website: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  fax: z.string().max(20).optional(),
});
export const updateClientSchema = createClientSchema;
export type CreateClientSchema = z.infer<typeof createClientSchema>;
export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

export const queryClientSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  sort_by: z.string().optional(),
  sort_dir: z.string().optional(),
});
export type QueryClientSchema = z.infer<typeof queryClientSchema>;

export const queryClientOptionsSchema = z.object({
  name: z.string().optional(),
  client_id: z.string().optional(),
});
export type QueryClientOptionsSchema = z.infer<typeof queryClientOptionsSchema>;
