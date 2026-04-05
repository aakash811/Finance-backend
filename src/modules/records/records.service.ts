import { query } from '../../config/database';
import { AppError } from '../../utils/appError';
import { Role } from '../../types';
import { CreateRecordDto, UpdateRecordDto, ListRecordsQuery } from './records.schemas';

interface RecordRow {
  id: string; amount: string; type: string; category: string;
  date: Date; notes: string | null; userId: string;
  createdAt: Date; updatedAt: Date;
  user_name?: string; user_email?: string;
}

export const recordsService = {
  async list(q: ListRecordsQuery, requesterId: string, requesterRole: Role) {
    const conditions: string[] = ['r."deletedAt" IS NULL'];
    const params: unknown[] = [];
    let i = 1;

    // Non-admins only see their own records
    if (requesterRole !== Role.ADMIN) {
      conditions.push(`r."userId" = $${i++}`);
      params.push(requesterId);
    }

    if (q.type)      { conditions.push(`r.type = $${i++}`);                                  params.push(q.type); }
    if (q.category)  { conditions.push(`r.category ILIKE $${i++}`);                          params.push(`%${q.category}%`); }
    if (q.startDate) { conditions.push(`r.date >= $${i++}`);                                 params.push(q.startDate); }
    if (q.endDate)   { conditions.push(`r.date <= $${i++}`);                                 params.push(q.endDate); }
    if (q.minAmount) { conditions.push(`r.amount >= $${i++}`);                               params.push(q.minAmount); }
    if (q.maxAmount) { conditions.push(`r.amount <= $${i++}`);                               params.push(q.maxAmount); }
    if (q.search)    { conditions.push(`(r.notes ILIKE $${i} OR r.category ILIKE $${i})`);   params.push(`%${q.search}%`); i++; }

    const where = conditions.join(' AND ');
    const validSortColumns: Record<string, string> = {
      date: 'r.date', amount: 'r.amount', created_at: 'r."createdAt"',
    };
    const orderBy = `${validSortColumns[q.sortBy]} ${q.sortOrder.toUpperCase()}`;
    const offset = (q.page - 1) * q.limit;

    const [rows, countRow] = await Promise.all([
      query<RecordRow>(
        `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes,
                r."userId", r."createdAt", r."updatedAt",
                u.name as user_name, u.email as user_email
         FROM financial_records r
         JOIN users u ON u.id = r."userId"
         WHERE ${where}
         ORDER BY ${orderBy}
         LIMIT $${i} OFFSET $${i + 1}`,
        [...params, q.limit, offset]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM financial_records r WHERE ${where}`, params
      ),
    ]);

    return {
      records: rows.rows,
      total: parseInt(countRow.rows[0].count, 10),
      page: q.page,
      limit: q.limit,
      totalPages: Math.ceil(parseInt(countRow.rows[0].count, 10) / q.limit),
    };
  },

  async getById(id: string, requesterId: string, requesterRole: Role) {
    const result = await query<RecordRow>(
      `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes,
              r."userId", r."createdAt", r."updatedAt",
              u.name as user_name, u.email as user_email
       FROM financial_records r
       JOIN users u ON u.id = r."userId"
       WHERE r.id = $1 AND r."deletedAt" IS NULL`,
      [id]
    );
    const record = result.rows[0];
    if (!record) throw new AppError('Record not found', 404);

    // Non-admins can only view their own records
    if (requesterRole !== Role.ADMIN && record.userId !== requesterId) {
      throw new AppError('Record not found', 404);
    }
    return record;
  },

  async create(dto: CreateRecordDto, requesterId: string) {
    // If admin provides a userId, assign to that user — otherwise assign to self
    const targetUserId = dto.userId ?? requesterId;

    // Verify target user exists
    if (dto.userId) {
      const userCheck = await query(
        'SELECT id FROM users WHERE id = $1 AND "deletedAt" IS NULL', [dto.userId]
      );
      if (!userCheck.rows[0]) throw new AppError('Target user not found', 404);
    }

    const result = await query<RecordRow>(
      `INSERT INTO financial_records (id, amount, type, category, date, notes, "userId", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, amount, type, category, date, notes, "userId", "createdAt", "updatedAt"`,
      [dto.amount, dto.type, dto.category, dto.date, dto.notes ?? null, targetUserId]
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateRecordDto, requesterId: string, requesterRole: Role) {
    await this.getById(id, requesterId, requesterRole);

    const sets: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (dto.amount   !== undefined) { sets.push(`amount = $${i++}`);   params.push(dto.amount); }
    if (dto.type     !== undefined) { sets.push(`type = $${i++}`);     params.push(dto.type); }
    if (dto.category !== undefined) { sets.push(`category = $${i++}`); params.push(dto.category); }
    if (dto.date     !== undefined) { sets.push(`date = $${i++}`);     params.push(dto.date); }
    if (dto.notes    !== undefined) { sets.push(`notes = $${i++}`);    params.push(dto.notes); }

    sets.push(`"updatedAt" = NOW()`);
    params.push(id);

    const result = await query<RecordRow>(
      `UPDATE financial_records SET ${sets.join(', ')}
       WHERE id = $${i} AND "deletedAt" IS NULL
       RETURNING id, amount, type, category, date, notes, "userId", "createdAt", "updatedAt"`,
      params
    );
    return result.rows[0];
  },

  async softDelete(id: string, requesterId: string, requesterRole: Role) {
    await this.getById(id, requesterId, requesterRole);
    await query(
      `UPDATE financial_records SET "deletedAt" = NOW(), "updatedAt" = NOW() WHERE id = $1`,
      [id]
    );
  },
};