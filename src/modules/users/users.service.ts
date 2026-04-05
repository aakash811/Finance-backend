import bcrypt from 'bcryptjs';
import { query } from '../../config/database';
import { AppError } from '../../utils/appError';
import { env } from '../../config/env';
import { Role, UserStatus } from '../../types';
import { CreateUserDto, UpdateUserDto, ListUsersQuery } from './users.schemas';

interface UserRow {
  id: string; email: string; name: string;
  role: Role; status: UserStatus;
  createdAt: Date; updatedAt: Date;
}

export const usersService = {
  async list(q: ListUsersQuery) {
    const conditions: string[] = ['"deletedAt" IS NULL'];
    const params: unknown[] = [];
    let i = 1;

    if (q.role)   { conditions.push(`role = $${i++}`);   params.push(q.role); }
    if (q.status) { conditions.push(`status = $${i++}`); params.push(q.status); }
    if (q.search) {
      conditions.push(`(name ILIKE $${i} OR email ILIKE $${i})`);
      params.push(`%${q.search}%`); i++;
    }

    const where = conditions.join(' AND ');
    const offset = (q.page - 1) * q.limit;

    const [rows, countRow] = await Promise.all([
      query<UserRow>(
        `SELECT id, email, name, role, status, "createdAt", "updatedAt"
         FROM users WHERE ${where}
         ORDER BY "createdAt" DESC LIMIT $${i} OFFSET $${i + 1}`,
        [...params, q.limit, offset]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM users WHERE ${where}`, params
      ),
    ]);

    return {
      users: rows.rows,
      total: parseInt(countRow.rows[0].count, 10),
      page: q.page,
      limit: q.limit,
      totalPages: Math.ceil(parseInt(countRow.rows[0].count, 10) / q.limit),
    };
  },

  async getById(id: string) {
    const result = await query<UserRow>(
      'SELECT id, email, name, role, status, "createdAt", "updatedAt" FROM users WHERE id = $1 AND "deletedAt" IS NULL',
      [id]
    );
    if (!result.rows[0]) throw new AppError('User not found', 404);
    return result.rows[0];
  },

  async create(dto: CreateUserDto) {
    const existing = await query(
      'SELECT id FROM users WHERE email = $1 AND "deletedAt" IS NULL', [dto.email]
    );
    if (existing.rows.length > 0) throw new AppError('Email already exists', 409);

    const hashed = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    const result = await query<UserRow>(
      `INSERT INTO users (id, email, name, password, role, status, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'ACTIVE', NOW(), NOW())
       RETURNING id, email, name, role, status, "createdAt", "updatedAt"`,
      [dto.email, dto.name, hashed, dto.role]
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateUserDto) {
    await this.getById(id);
    const sets: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (dto.name)   { sets.push(`name = $${i++}`);   params.push(dto.name); }
    if (dto.role)   { sets.push(`role = $${i++}`);   params.push(dto.role); }
    if (dto.status) { sets.push(`status = $${i++}`); params.push(dto.status); }

    sets.push(`"updatedAt" = NOW()`);
    params.push(id);

    const result = await query<UserRow>(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${i} AND "deletedAt" IS NULL
       RETURNING id, email, name, role, status, "createdAt", "updatedAt"`,
      params
    );
    return result.rows[0];
  },

  async softDelete(id: string, requesterId: string) {
    if (id === requesterId) throw new AppError('Cannot delete your own account', 400);
    await this.getById(id);
    await query(
      `UPDATE users SET "deletedAt" = NOW(), "updatedAt" = NOW(), status = 'INACTIVE' WHERE id = $1`,
      [id]
    );
  },
};