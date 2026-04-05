-- Run this once against your PostgreSQL database
-- psql -U postgres -d finance_db -f src/prisma/migrate.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE role_enum       AS ENUM ('VIEWER', 'ANALYST', 'ADMIN');
CREATE TYPE status_enum     AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE record_type_enum AS ENUM ('INCOME', 'EXPENSE');

CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  name          VARCHAR(100) NOT NULL,
  password      VARCHAR(255) NOT NULL,
  role          role_enum    NOT NULL DEFAULT 'VIEWER',
  status        status_enum  NOT NULL DEFAULT 'ACTIVE',
  refresh_token TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  deletedAt    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status     ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_deletedAt ON users(deletedAt);

CREATE TABLE IF NOT EXISTS financial_records (
  id         UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  amount     NUMERIC(15, 2)    NOT NULL CHECK (amount > 0),
  type       record_type_enum  NOT NULL,
  category   VARCHAR(100)      NOT NULL,
  date       TIMESTAMPTZ       NOT NULL,
  notes      TEXT,
  user_id    UUID              NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  deletedAt TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_records_user_id    ON financial_records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_type       ON financial_records(type);
CREATE INDEX IF NOT EXISTS idx_records_category   ON financial_records(category);
CREATE INDEX IF NOT EXISTS idx_records_date       ON financial_records(date);
CREATE INDEX IF NOT EXISTS idx_records_deletedAt ON financial_records(deletedAt);