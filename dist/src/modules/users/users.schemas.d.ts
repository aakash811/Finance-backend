import { z } from 'zod';
import { Role, UserStatus } from '../../types';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<typeof Role>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: Role;
}, {
    name: string;
    email: string;
    password: string;
    role?: Role | undefined;
}>;
export declare const updateUserSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof Role>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof UserStatus>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    status?: UserStatus | undefined;
    role?: Role | undefined;
}, {
    name?: string | undefined;
    status?: UserStatus | undefined;
    role?: Role | undefined;
}>, {
    name?: string | undefined;
    status?: UserStatus | undefined;
    role?: Role | undefined;
}, {
    name?: string | undefined;
    status?: UserStatus | undefined;
    role?: Role | undefined;
}>;
export declare const userIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const listUsersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof Role>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof UserStatus>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: UserStatus | undefined;
    role?: Role | undefined;
    search?: string | undefined;
}, {
    limit?: number | undefined;
    status?: UserStatus | undefined;
    role?: Role | undefined;
    page?: number | undefined;
    search?: string | undefined;
}>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersSchema>;
