"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../config/database");
const appError_1 = require("../../utils/appError");
const env_1 = require("../../config/env");
exports.usersService = {
    async list(q) {
        const conditions = ['"deletedAt" IS NULL'];
        const params = [];
        let i = 1;
        if (q.role) {
            conditions.push(`role = $${i++}`);
            params.push(q.role);
        }
        if (q.status) {
            conditions.push(`status = $${i++}`);
            params.push(q.status);
        }
        if (q.search) {
            conditions.push(`(name ILIKE $${i} OR email ILIKE $${i})`);
            params.push(`%${q.search}%`);
            i++;
        }
        const where = conditions.join(' AND ');
        const offset = (q.page - 1) * q.limit;
        const [rows, countRow] = await Promise.all([
            (0, database_1.query)(`SELECT id, email, name, role, status, "createdAt", "updatedAt"
         FROM users WHERE ${where}
         ORDER BY "createdAt" DESC LIMIT $${i} OFFSET $${i + 1}`, [...params, q.limit, offset]),
            (0, database_1.query)(`SELECT COUNT(*) as count FROM users WHERE ${where}`, params),
        ]);
        return {
            users: rows.rows,
            total: parseInt(countRow.rows[0].count, 10),
            page: q.page,
            limit: q.limit,
            totalPages: Math.ceil(parseInt(countRow.rows[0].count, 10) / q.limit),
        };
    },
    async getById(id) {
        const result = await (0, database_1.query)('SELECT id, email, name, role, status, "createdAt", "updatedAt" FROM users WHERE id = $1 AND "deletedAt" IS NULL', [id]);
        if (!result.rows[0])
            throw new appError_1.AppError('User not found', 404);
        return result.rows[0];
    },
    async create(dto) {
        const existing = await (0, database_1.query)('SELECT id FROM users WHERE email = $1 AND "deletedAt" IS NULL', [dto.email]);
        if (existing.rows.length > 0)
            throw new appError_1.AppError('Email already exists', 409);
        const hashed = await bcryptjs_1.default.hash(dto.password, env_1.env.BCRYPT_ROUNDS);
        const result = await (0, database_1.query)(`INSERT INTO users (id, email, name, password, role, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'ACTIVE', NOW(), NOW())
       RETURNING id, email, name, role, status, "createdAt", "updatedAt"`, [dto.email, dto.name, hashed, dto.role]);
        return result.rows[0];
    },
    async update(id, dto) {
        await this.getById(id);
        const sets = [];
        const params = [];
        let i = 1;
        if (dto.name) {
            sets.push(`name = $${i++}`);
            params.push(dto.name);
        }
        if (dto.role) {
            sets.push(`role = $${i++}`);
            params.push(dto.role);
        }
        if (dto.status) {
            sets.push(`status = $${i++}`);
            params.push(dto.status);
        }
        sets.push(`"updatedAt" = NOW()`);
        params.push(id);
        const result = await (0, database_1.query)(`UPDATE users SET ${sets.join(', ')} WHERE id = $${i} AND "deletedAt" IS NULL
       RETURNING id, email, name, role, status, "createdAt", "updatedAt"`, params);
        return result.rows[0];
    },
    async softDelete(id, requesterId) {
        if (id === requesterId)
            throw new appError_1.AppError('Cannot delete your own account', 400);
        await this.getById(id);
        await (0, database_1.query)(`UPDATE users SET "deletedAt" = NOW(), "updatedAt" = NOW(), status = 'INACTIVE' WHERE id = $1`, [id]);
    },
};
//# sourceMappingURL=users.service.js.map