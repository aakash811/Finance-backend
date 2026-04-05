import { query } from '../../config/database';
import { Role } from '../../types';

export const dashboardService = {
  async getSummary(userId: string, role: Role) {
    const scope = role === Role.ADMIN ? '' : `AND "userId" = '${userId}'`;

    const result = await query<{
      total_income: string; total_expense: string;
      record_count: string; income_count: string; expense_count: string;
    }>(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense,
         COUNT(*)                                                              AS record_count,
         COUNT(CASE WHEN type = 'INCOME'  THEN 1 END)                        AS income_count,
         COUNT(CASE WHEN type = 'EXPENSE' THEN 1 END)                        AS expense_count
       FROM financial_records
       WHERE "deletedAt" IS NULL ${scope}`
    );

    const row = result.rows[0];
    const totalIncome  = parseFloat(row.total_income);
    const totalExpense = parseFloat(row.total_expense);

    return {
      totalIncome,
      totalExpense,
      netBalance:   totalIncome - totalExpense,
      recordCount:  parseInt(row.record_count, 10),
      incomeCount:  parseInt(row.income_count, 10),
      expenseCount: parseInt(row.expense_count, 10),
    };
  },

  async getCategoryTotals(userId: string, role: Role) {
    const scope = role === Role.ADMIN ? '' : `AND "userId" = '${userId}'`;

    const result = await query<{ category: string; type: string; total: string; count: string }>(
      `SELECT category, type,
              SUM(amount) AS total,
              COUNT(*)    AS count
       FROM financial_records
       WHERE "deletedAt" IS NULL ${scope}
       GROUP BY category, type
       ORDER BY total DESC`
    );
    return result.rows.map(r => ({
      category: r.category,
      type:     r.type,
      total:    parseFloat(r.total),
      count:    parseInt(r.count, 10),
    }));
  },

  async getMonthlyTrends(userId: string, role: Role, months = 12) {
    const scope = role === Role.ADMIN ? '' : `AND "userId" = '${userId}'`;

    const result = await query<{ month: string; type: string; total: string; count: string }>(
      `SELECT TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month,
              type,
              SUM(amount) AS total,
              COUNT(*)    AS count
       FROM financial_records
       WHERE "deletedAt" IS NULL
         AND date >= NOW() - INTERVAL '${months} months'
         ${scope}
       GROUP BY DATE_TRUNC('month', date), type
       ORDER BY month ASC`
    );

    const map: Record<string, { month: string; income: number; expense: number; net: number }> = {};
    for (const row of result.rows) {
      if (!map[row.month]) map[row.month] = { month: row.month, income: 0, expense: 0, net: 0 };
      const val = parseFloat(row.total);
      if (row.type === 'INCOME')  map[row.month].income  += val;
      if (row.type === 'EXPENSE') map[row.month].expense += val;
      map[row.month].net = map[row.month].income - map[row.month].expense;
    }
    return Object.values(map);
  },

  async getWeeklyTrends(userId: string, role: Role, weeks = 8) {
    const scope = role === Role.ADMIN ? '' : `AND "userId" = '${userId}'`;

    const result = await query<{ week: string; type: string; total: string }>(
      `SELECT TO_CHAR(DATE_TRUNC('week', date), 'YYYY-MM-DD') AS week,
              type,
              SUM(amount) AS total
       FROM financial_records
       WHERE "deletedAt" IS NULL
         AND date >= NOW() - INTERVAL '${weeks} weeks'
         ${scope}
       GROUP BY DATE_TRUNC('week', date), type
       ORDER BY week ASC`
    );

    const map: Record<string, { week: string; income: number; expense: number; net: number }> = {};
    for (const row of result.rows) {
      if (!map[row.week]) map[row.week] = { week: row.week, income: 0, expense: 0, net: 0 };
      const val = parseFloat(row.total);
      if (row.type === 'INCOME')  map[row.week].income  += val;
      if (row.type === 'EXPENSE') map[row.week].expense += val;
      map[row.week].net = map[row.week].income - map[row.week].expense;
    }
    return Object.values(map);
  },

  async getRecentActivity(userId: string, role: Role, limit = 10) {
    const scope = role === Role.ADMIN ? '' : `AND r."userId" = '${userId}'`;

    const result = await query<{
      id: string; amount: string; type: string; category: string;
      date: Date; notes: string | null; user_name: string;
    }>(
      `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes, u.name AS user_name
       FROM financial_records r
       JOIN users u ON u.id = r."userId"
       WHERE r."deletedAt" IS NULL ${scope}
       ORDER BY r."createdAt" DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map(r => ({ ...r, amount: parseFloat(r.amount) }));
  },

  async getTopCategories(userId: string, role: Role, limit = 5) {
    const scope = role === Role.ADMIN ? '' : `AND "userId" = '${userId}'`;

    const result = await query<{ category: string; total: string; percentage: string }>(
      `WITH totals AS (
         SELECT category, SUM(amount) AS total
         FROM financial_records
         WHERE "deletedAt" IS NULL AND type = 'EXPENSE' ${scope}
         GROUP BY category
       ),
       grand AS (SELECT SUM(total) AS grand_total FROM totals)
       SELECT t.category,
              t.total,
              ROUND((t.total / g.grand_total * 100), 2) AS percentage
       FROM totals t, grand g
       ORDER BY t.total DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map(r => ({
      category:   r.category,
      total:      parseFloat(r.total),
      percentage: parseFloat(r.percentage),
    }));
  },
};