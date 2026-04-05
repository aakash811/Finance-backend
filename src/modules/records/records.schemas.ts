import { z } from 'zod';
import { RecordType } from '../../types';

export const createRecordSchema = z.object({
  amount:   z.number().positive().multipleOf(0.01),
  type:     z.nativeEnum(RecordType),
  category: z.string().min(1).max(100),
  date:     z.string().datetime({ message: 'Date must be ISO 8601 format' }),
  notes:    z.string().max(500).optional(),
  userId:   z.string().uuid().optional(), // Admin can assign to a specific user
});

export const updateRecordSchema = z.object({
  amount:   z.number().positive().multipleOf(0.01).optional(),
  type:     z.nativeEnum(RecordType).optional(),
  category: z.string().min(1).max(100).optional(),
  date:     z.string().datetime().optional(),
  notes:    z.string().max(500).nullable().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });

export const recordIdSchema = z.object({
  id: z.string().uuid(),
});

export const listRecordsSchema = z.object({
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
  type:      z.nativeEnum(RecordType).optional(),
  category:  z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate:   z.string().datetime().optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  search:    z.string().optional(),
  sortBy:    z.enum(['date', 'amount', 'created_at']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateRecordDto = z.infer<typeof createRecordSchema>;
export type UpdateRecordDto = z.infer<typeof updateRecordSchema>;
export type ListRecordsQuery = z.infer<typeof listRecordsSchema>;