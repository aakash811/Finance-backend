import { z } from 'zod';
import { Role, UserStatus } from '../../types';

export const createUserSchema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(8).max(72).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and a number'
  ),
  role:     z.nativeEnum(Role).optional().default(Role.VIEWER),
});

export const updateUserSchema = z.object({
  name:   z.string().min(2).max(100).optional(),
  role:   z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });

export const userIdSchema = z.object({
  id: z.string().uuid(),
});

export const listUsersSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
  role:   z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  search: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersSchema>;