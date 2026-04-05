import { Response, NextFunction } from 'express';
import { recordsService } from './records.service';
import { sendSuccess } from '../../utils/response';
import { audit } from '../../utils/audit';
import { AuthRequest, Role } from '../../types';
import { CreateRecordDto, UpdateRecordDto, ListRecordsQuery } from './records.schemas';

export const recordsController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await recordsService.list(
        req.query as unknown as ListRecordsQuery,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, result.records, 'Records fetched', 200, {
        page: result.page, limit: result.limit,
        total: result.total, totalPages: result.totalPages,
      });
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.getById(
        req.params.id, req.user!.userId, req.user!.role
      );
      sendSuccess(res, record, 'Record fetched');
    } catch (err) { next(err); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.create(req.body as CreateRecordDto, req.user!.userId);
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'CREATE', resource: 'RECORD', resourceId: record.id, req });
      sendSuccess(res, record, 'Record created', 201);
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const record = await recordsService.update(
        req.params.id, req.body as UpdateRecordDto,
        req.user!.userId, req.user!.role
      );
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'UPDATE', resource: 'RECORD', resourceId: req.params.id,
        changes: req.body, req });
      sendSuccess(res, record, 'Record updated');
    } catch (err) { next(err); }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await recordsService.softDelete(req.params.id, req.user!.userId, req.user!.role);
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'DELETE', resource: 'RECORD', resourceId: req.params.id, req });
      sendSuccess(res, null, 'Record deleted');
    } catch (err) { next(err); }
  },
};