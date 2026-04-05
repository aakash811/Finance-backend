import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFound } from './middleware/error.middleware';
import { setupSwagger } from './config/swagger';

import authRoutes      from './modules/auth/auth.routes';
import usersRoutes     from './modules/users/users.routes';
import recordsRoutes   from './modules/records/records.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

const app: Application = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Logging (skip in test env)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(globalRateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Finance API is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/users',     usersRoutes);
app.use('/api/v1/records',   recordsRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Swagger docs
setupSwagger(app);

// 404 + global error handler
app.use(notFound);
app.use(errorHandler);

export default app;