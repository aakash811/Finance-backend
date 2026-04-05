import 'dotenv/config';
import app from './app';
import { connectPostgres, connectMongo, disconnectAll } from './config/database';
import { logger } from './utils/logger';
import { env } from './config/env';

const start = async () => {
  await connectPostgres();
  await connectMongo();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`Swagger UI → http://localhost:${env.PORT}/api-docs`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectAll();
      logger.info('Connections closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

start().catch((err) => {
  logger.error('Failed to start server', { err });
  process.exit(1);
});