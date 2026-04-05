import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
export declare const pool: Pool;
export declare const query: <T extends QueryResultRow>(text: string, params?: unknown[]) => Promise<QueryResult<T>>;
export declare const getClient: () => Promise<PoolClient>;
export declare const connectPostgres: () => Promise<void>;
export declare const connectMongo: () => Promise<void>;
export declare const disconnectAll: () => Promise<void>;
