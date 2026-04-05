import { Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { sendSuccess } from '../../utils/response';
import { audit } from '../../utils/audit';
import { AuthRequest } from '../../types';
import { CreateUserDto, UpdateUserDto, ListUsersQuery } from './users.schemas';

export const usersController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await usersService.list(req.query as unknown as ListUsersQuery);
      sendSuccess(res, result.users, 'Users fetched', 200, {
        page: result.page, limit: result.limit,
        total: result.total, totalPages: result.totalPages,
      });
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getById(req.params.id);
      sendSuccess(res, user, 'User fetched');
    } catch (err) { next(err); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.create(req.body as CreateUserDto);
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'CREATE', resource: 'USER', resourceId: user.id, req });
      sendSuccess(res, user, 'User created', 201);
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.update(req.params.id, req.body as UpdateUserDto);
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'UPDATE', resource: 'USER', resourceId: req.params.id,
        changes: req.body, req });
      sendSuccess(res, user, 'User updated');
    } catch (err) { next(err); }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await usersService.softDelete(req.params.id, req.user!.userId);
      await audit({ userId: req.user!.userId, userEmail: req.user!.email,
        action: 'DELETE', resource: 'USER', resourceId: req.params.id, req });
      sendSuccess(res, null, 'User deleted');
    } catch (err) { next(err); }
  },
};