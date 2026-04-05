import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', { err: err.message });
});

export const query = <T extends QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

export const getClient = (): Promise<PoolClient> => pool.connect();

export const connectPostgres = async (): Promise<void> => {
  const client = await pool.connect();
  client.release();
  logger.info('PostgreSQL connected');
};

export const connectMongo = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    logger.warn('MONGODB_URI not set — skipping MongoDB');
    return;
  }
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.warn('MongoDB unavailable — audit logging disabled', { err });
  }
};

export const disconnectAll = async (): Promise<void> => {
  await pool.end();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
};