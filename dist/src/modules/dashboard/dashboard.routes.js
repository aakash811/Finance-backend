"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// All roles (viewer+) can see summary and recent activity
router.get('/summary', role_middleware_1.requireViewer, dashboard_controller_1.dashboardController.summary);
router.get('/recent-activity', role_middleware_1.requireViewer, dashboard_controller_1.dashboardController.recentActivity);
// Analyst+ for deeper analytics
router.get('/categories', role_middleware_1.requireAnalyst, dashboard_controller_1.dashboardController.categoryTotals);
router.get('/trends/monthly', role_middleware_1.requireAnalyst, dashboard_controller_1.dashboardController.monthlyTrends);
router.get('/trends/weekly', role_middleware_1.requireAnalyst, dashboard_controller_1.dashboardController.weeklyTrends);
router.get('/top-categories', role_middleware_1.requireAnalyst, dashboard_controller_1.dashboardController.topCategories);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map