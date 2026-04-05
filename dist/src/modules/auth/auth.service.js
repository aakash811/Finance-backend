"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
const appError_1 = require("../../utils/appError");
const signAccess = (payload) => jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
const signRefresh = (userId) => jsonwebtoken_1.default.sign({ userId }, env_1.env.JWT_REFRESH_SECRET, { expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN });
exports.authService = {
    async register(dto) {
        const existing = await (0, database_1.query)('SELECT id FROM users WHERE email = $1 AND "deletedAt" IS NULL', [dto.email]);
        if (existing.rows.length > 0)
            throw new appError_1.AppError('Email already registered', 409);
        const hashed = await bcryptjs_1.default.hash(dto.password, env_1.env.BCRYPT_ROUNDS);
        const result = await (0, database_1.query)(`INSERT INTO users (id, email, name, password, role, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'VIEWER', 'ACTIVE', NOW(), NOW())
       RETURNING id, email, name, role, status`, [dto.email, dto.name, hashed]);
        const user = result.rows[0];
        const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = signRefresh(user.id);
        await (0, database_1.query)('UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2', [refreshToken, user.id]);
        return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
    },
    async login(dto) {
        const result = await (0, database_1.query)('SELECT id, email, name, password, role, status FROM users WHERE email = $1 AND "deletedAt" IS NULL', [dto.email]);
        const user = result.rows[0];
        if (!user)
            throw new appError_1.AppError('Invalid credentials', 401);
        if (user.status === 'INACTIVE')
            throw new appError_1.AppError('Account is inactive', 403);
        const valid = await bcryptjs_1.default.compare(dto.password, user.password);
        if (!valid)
            throw new appError_1.AppError('Invalid credentials', 401);
        const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = signRefresh(user.id);
        await (0, database_1.query)('UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2', [refreshToken, user.id]);
        return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
    },
    async refresh(token) {
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
        }
        catch {
            throw new appError_1.AppError('Invalid or expired refresh token', 401);
        }
        const result = await (0, database_1.query)('SELECT id, email, role, status, "refreshToken" as refresh_token FROM users WHERE id = $1 AND "deletedAt" IS NULL', [payload.userId]);
        const user = result.rows[0];
        if (!user || user.refresh_token !== token) {
            throw new appError_1.AppError('Refresh token revoked', 401);
        }
        if (user.status === 'INACTIVE')
            throw new appError_1.AppError('Account is inactive', 403);
        const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
        const newRefresh = signRefresh(user.id);
        await (0, database_1.query)('UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2', [newRefresh, user.id]);
        return { accessToken, refreshToken: newRefresh };
    },
    async logout(userId) {
        await (0, database_1.query)('UPDATE users SET "refreshToken" = NULL, "updatedAt" = NOW() WHERE id = $1', [userId]);
    },
};
//# sourceMappingURL=auth.service.js.map