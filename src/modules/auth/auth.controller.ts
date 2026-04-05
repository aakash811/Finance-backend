import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../types';
import { RegisterDto, LoginDto, RefreshDto } from './auth.schemas';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body as RegisterDto);
      sendSuccess(res, result, 'Registered successfully', 201);
    } catch (err) { next(err); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body as LoginDto);
      sendSuccess(res, result, 'Logged in successfully');
    } catch (err) { next(err); }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as RefreshDto;
      const result = await authService.refresh(refreshToken);
      sendSuccess(res, result, 'Token refreshed');
    } catch (err) { next(err); }
  },

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.userId);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) { next(err); }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, req.user, 'Current user');
    } catch (err) { next(err); }
  },
};