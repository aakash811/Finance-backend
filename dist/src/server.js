"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const env_1 = require("./config/env");
const start = async () => {
    await (0, database_1.connectPostgres)();
    await (0, database_1.connectMongo)();
    const server = app_1.default.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server running on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
        logger_1.logger.info(`Swagger UI → http://localhost:${env_1.env.PORT}/api-docs`);
    });
    const shutdown = async (signal) => {
        logger_1.logger.info(`${signal} received — shutting down`);
        server.close(async () => {
            await (0, database_1.disconnectAll)();
            logger_1.logger.info('Connections closed');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};
start().catch((err) => {
    logger_1.logger.error('Failed to start server', { err });
    process.exit(1);
});
//# sourceMappingURL=server.js.map