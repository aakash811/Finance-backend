"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRecordsSchema = exports.recordIdSchema = exports.updateRecordSchema = exports.createRecordSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../../types");
exports.createRecordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().multipleOf(0.01),
    type: zod_1.z.nativeEnum(types_1.RecordType),
    category: zod_1.z.string().min(1).max(100),
    date: zod_1.z.string().datetime({ message: 'Date must be ISO 8601 format' }),
    notes: zod_1.z.string().max(500).optional(),
    userId: zod_1.z.string().uuid().optional(), // Admin can assign to a specific user
});
exports.updateRecordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().multipleOf(0.01).optional(),
    type: zod_1.z.nativeEnum(types_1.RecordType).optional(),
    category: zod_1.z.string().min(1).max(100).optional(),
    date: zod_1.z.string().datetime().optional(),
    notes: zod_1.z.string().max(500).nullable().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });
exports.recordIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listRecordsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    type: zod_1.z.nativeEnum(types_1.RecordType).optional(),
    category: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    minAmount: zod_1.z.coerce.number().positive().optional(),
    maxAmount: zod_1.z.coerce.number().positive().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['date', 'amount', 'created_at']).default('date'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=records.schemas.js.map