"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = exports.userIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../../types");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(72).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and a number'),
    role: zod_1.z.nativeEnum(types_1.Role).optional().default(types_1.Role.VIEWER),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    role: zod_1.z.nativeEnum(types_1.Role).optional(),
    status: zod_1.z.nativeEnum(types_1.UserStatus).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listUsersSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    role: zod_1.z.nativeEnum(types_1.Role).optional(),
    status: zod_1.z.nativeEnum(types_1.UserStatus).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=users.schemas.js.map