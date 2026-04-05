import { z } from 'zod';
import { RecordType } from '../../types';
export declare const createRecordSchema: z.ZodObject<{
    amount: z.ZodNumber;
    type: z.ZodNativeEnum<typeof RecordType>;
    category: z.ZodString;
    date: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: RecordType;
    date: string;
    amount: number;
    category: string;
    userId?: string | undefined;
    notes?: string | undefined;
}, {
    type: RecordType;
    date: string;
    amount: number;
    category: string;
    userId?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateRecordSchema: z.ZodEffects<z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof RecordType>>;
    category: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: RecordType | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | null | undefined;
}, {
    type?: RecordType | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | null | undefined;
}>, {
    type?: RecordType | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | null | undefined;
}, {
    type?: RecordType | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | null | undefined;
}>;
export declare const recordIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const listRecordsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof RecordType>>;
    category: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    minAmount: z.ZodOptional<z.ZodNumber>;
    maxAmount: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodEnum<["date", "amount", "created_at"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "date" | "amount" | "created_at";
    sortOrder: "asc" | "desc";
    type?: RecordType | undefined;
    search?: string | undefined;
    category?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
}, {
    limit?: number | undefined;
    type?: RecordType | undefined;
    page?: number | undefined;
    search?: string | undefined;
    category?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
    sortBy?: "date" | "amount" | "created_at" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type CreateRecordDto = z.infer<typeof createRecordSchema>;
export type UpdateRecordDto = z.infer<typeof updateRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsSchema>;
