import { Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../types';

const parsePositiveInt = (val: unknown, defaultVal: number, max: number): number => {
  const n = parseInt(String(val), 10);
  if (isNaN(n) || n < 1) return defaultVal;
  return Math.min(n, max);
};

export const dashboardController = {
  async summary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getSummary(req.user!.userId, req.user!.role);
      sendSuccess(res, data, 'Dashboard summary');
    } catch (err) { next(err); }
  },

  async categoryTotals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getCategoryTotals(req.user!.userId, req.user!.role);
      sendSuccess(res, data, 'Category totals');
    } catch (err) { next(err); }
  },

  async monthlyTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const months = parsePositiveInt(req.query.months, 12, 60);
      const data = await dashboardService.getMonthlyTrends(req.user!.userId, req.user!.role, months);
      sendSuccess(res, data, 'Monthly trends');
    } catch (err) { next(err); }
  },

  async weeklyTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const weeks = parsePositiveInt(req.query.weeks, 8, 52);
      const data = await dashboardService.getWeeklyTrends(req.user!.userId, req.user!.role, weeks);
      sendSuccess(res, data, 'Weekly trends');
    } catch (err) { next(err); }
  },

  async recentActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parsePositiveInt(req.query.limit, 10, 50);
      const data = await dashboardService.getRecentActivity(req.user!.userId, req.user!.role, limit);
      sendSuccess(res, data, 'Recent activity');
    } catch (err) { next(err); }
  },

  async topCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parsePositiveInt(req.query.limit, 5, 20);
      const data = await dashboardService.getTopCategories(req.user!.userId, req.user!.role, limit);
      sendSuccess(res, data, 'Top expense categories');
    } catch (err) { next(err); }
  },
};