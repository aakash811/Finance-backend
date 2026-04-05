import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../utils/appError';
import { Role, JwtPayload } from '../../types';
import { RegisterDto, LoginDto } from './auth.schemas';

interface UserRow {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  status: string;
  refresh_token?: string;
}

const signAccess = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

const signRefresh = (userId: string): string =>
  jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const authService = {
  async register(dto: RegisterDto) {
    const existing = await query<UserRow>(
      'SELECT id FROM users WHERE email = $1 AND "deletedAt" IS NULL',
      [dto.email]
    );
    if (existing.rows.length > 0) throw new AppError('Email already registered', 409);

    const hashed = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    const result = await query<UserRow>(
      `INSERT INTO users (id, email, name, password, role, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, 'VIEWER', 'ACTIVE', NOW(), NOW())
       RETURNING id, email, name, role, status`,
      [dto.email, dto.name, hashed]
    );
    const user = result.rows[0];
    const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefresh(user.id);
    await query(
      'UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2',
      [refreshToken, user.id]
    );
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
  },

  async login(dto: LoginDto) {
    const result = await query<UserRow>(
      'SELECT id, email, name, password, role, status FROM users WHERE email = $1 AND "deletedAt" IS NULL',
      [dto.email]
    );
    const user = result.rows[0];
    if (!user) throw new AppError('Invalid credentials', 401);
    if (user.status === 'INACTIVE') throw new AppError('Account is inactive', 403);

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefresh(user.id);
    await query(
      'UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2',
      [refreshToken, user.id]
    );
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
  },

  async refresh(token: string) {
    let payload: { userId: string };
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
    const result = await query<UserRow>(
      'SELECT id, email, role, status, "refreshToken" as refresh_token FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [payload.userId]
    );
    const user = result.rows[0];
    if (!user || user.refresh_token !== token) {
      throw new AppError('Refresh token revoked', 401);
    }
    if (user.status === 'INACTIVE') throw new AppError('Account is inactive', 403);
    const accessToken = signAccess({ userId: user.id, email: user.email, role: user.role });
    const newRefresh = signRefresh(user.id);
    await query(
      'UPDATE users SET "refreshToken" = $1, "updatedAt" = NOW() WHERE id = $2',
      [newRefresh, user.id]
    );
    return { accessToken, refreshToken: newRefresh };
  },

  async logout(userId: string) {
    await query(
      'UPDATE users SET "refreshToken" = NULL, "updatedAt" = NOW() WHERE id = $1',
      [userId]
    );
  },
};