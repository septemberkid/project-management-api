import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().max(100),
  email: z.string().email().max(100),
  password: z.string().min(8).max(20),
});
export const signInSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(8).max(20),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
