import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare const dashboardController: {
    summary(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    categoryTotals(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    monthlyTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    weeklyTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    recentActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    topCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
