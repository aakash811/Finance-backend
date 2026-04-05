import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAnalyst, requireViewer } from '../../middleware/role.middleware';

const router: Router = Router();

router.use(authenticate);

// All roles (viewer+) can see summary and recent activity
router.get('/summary',         requireViewer,  dashboardController.summary);
router.get('/recent-activity', requireViewer,  dashboardController.recentActivity);

// Analyst+ for deeper analytics
router.get('/categories',      requireAnalyst, dashboardController.categoryTotals);
router.get('/trends/monthly',  requireAnalyst, dashboardController.monthlyTrends);
router.get('/trends/weekly',   requireAnalyst, dashboardController.weeklyTrends);
router.get('/top-categories',  requireAnalyst, dashboardController.topCategories);

export default router;