import { Request } from 'express';
import { AuditLog } from '../models/auditLog';
import { logger } from './logger';
import mongoose from 'mongoose';

interface AuditParams {
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  success?: boolean;
  errorMessage?: string;
  req?: Request;
}

export const audit = async (params: AuditParams): Promise<void> => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    await AuditLog.create({
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      changes: params.changes,
      success: params.success ?? true,
      errorMessage: params.errorMessage,
      ipAddress: params.req?.ip,
      userAgent: params.req?.get('user-agent'),
    });
  } catch (err) {
    logger.warn('Audit log write failed', { err });
  }
};