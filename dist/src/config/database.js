"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectAll = exports.connectMongo = exports.connectPostgres = exports.getClient = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const env_1 = require("./env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
exports.pool.on('error', (err) => {
    logger_1.logger.error('PostgreSQL pool error', { err: err.message });
});
const query = (text, params) => exports.pool.query(text, params);
exports.query = query;
const getClient = () => exports.pool.connect();
exports.getClient = getClient;
const connectPostgres = async () => {
    const client = await exports.pool.connect();
    client.release();
    logger_1.logger.info('PostgreSQL connected');
};
exports.connectPostgres = connectPostgres;
const connectMongo = async () => {
    if (!env_1.env.MONGODB_URI) {
        logger_1.logger.warn('MONGODB_URI not set — skipping MongoDB');
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        logger_1.logger.info('MongoDB connected');
    }
    catch (err) {
        logger_1.logger.warn('MongoDB unavailable — audit logging disabled', { err });
    }
};
exports.connectMongo = connectMongo;
const disconnectAll = async () => {
    await exports.pool.end();
    if (mongoose_1.default.connection.readyState !== 0)
        await mongoose_1.default.disconnect();
};
exports.disconnectAll = disconnectAll;
//# sourceMappingURL=database.js.map