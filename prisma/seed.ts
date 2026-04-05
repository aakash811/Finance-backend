import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/database';
import { logger } from '../src/utils/logger';

const seed = async () => {
  const password = await bcrypt.hash('Admin@123', 10);

  await pool.query(`
    INSERT INTO users (id, email, name, password, role, status, "createdAt", "updatedAt")
    VALUES
      (gen_random_uuid(), 'admin@finance.com',   'Admin User',   $1, 'ADMIN',   'ACTIVE', NOW(), NOW()),
      (gen_random_uuid(), 'analyst@finance.com', 'Analyst User', $1, 'ANALYST', 'ACTIVE', NOW(), NOW()),
      (gen_random_uuid(), 'viewer@finance.com',  'Viewer User',  $1, 'VIEWER',  'ACTIVE', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
  `, [password]);

  const adminRes = await pool.query(`SELECT id FROM users WHERE email = 'admin@finance.com'`);
  const adminId = adminRes.rows[0]?.id;

  if (adminId) {
    await pool.query(`
      INSERT INTO financial_records (id, amount, type, category, date, notes, "userId", "createdAt", "updatedAt")
      VALUES
        (gen_random_uuid(), 5000.00,  'INCOME',  'Salary',        NOW() - INTERVAL '1 day',  'Monthly salary',   $1, NOW(), NOW()),
        (gen_random_uuid(), 1200.50,  'EXPENSE', 'Rent',          NOW() - INTERVAL '2 days', 'Monthly rent',     $1, NOW(), NOW()),
        (gen_random_uuid(), 300.00,   'EXPENSE', 'Groceries',     NOW() - INTERVAL '3 days', 'Weekly shopping',  $1, NOW(), NOW()),
        (gen_random_uuid(), 2000.00,  'INCOME',  'Freelance',     NOW() - INTERVAL '5 days', 'Project payment',  $1, NOW(), NOW()),
        (gen_random_uuid(), 150.00,   'EXPENSE', 'Utilities',     NOW() - INTERVAL '6 days', 'Electricity bill', $1, NOW(), NOW()),
        (gen_random_uuid(), 80.00,    'EXPENSE', 'Transport',     NOW() - INTERVAL '7 days', 'Monthly pass',     $1, NOW(), NOW()),
        (gen_random_uuid(), 500.00,   'EXPENSE', 'Entertainment', NOW() - INTERVAL '10 days','Streaming + gym',  $1, NOW(), NOW()),
        (gen_random_uuid(), 1000.00,  'INCOME',  'Bonus',         NOW() - INTERVAL '15 days','Q2 bonus',         $1, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [adminId]);
  }

  logger.info('Seed complete ✓');
  await pool.end();
};

seed().catch((err) => { logger.error('Seed failed', { err }); process.exit(1); });