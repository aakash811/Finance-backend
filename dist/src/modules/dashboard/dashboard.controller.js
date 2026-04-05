"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../utils/response");
const parsePositiveInt = (val, defaultVal, max) => {
    const n = parseInt(String(val), 10);
    if (isNaN(n) || n < 1)
        return defaultVal;
    return Math.min(n, max);
};
exports.dashboardController = {
    async summary(req, res, next) {
        try {
            const data = await dashboard_service_1.dashboardService.getSummary(req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, data, 'Dashboard summary');
        }
        catch (err) {
            next(err);
        }
    },
    async categoryTotals(req, res, next) {
        try {
            const data = await dashboard_service_1.dashboardService.getCategoryTotals(req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, data, 'Category totals');
        }
        catch (err) {
            next(err);
        }
    },
    async monthlyTrends(req, res, next) {
        try {
            const months = parsePositiveInt(req.query.months, 12, 60);
            const data = await dashboard_service_1.dashboardService.getMonthlyTrends(req.user.userId, req.user.role, months);
            (0, response_1.sendSuccess)(res, data, 'Monthly trends');
        }
        catch (err) {
            next(err);
        }
    },
    async weeklyTrends(req, res, next) {
        try {
            const weeks = parsePositiveInt(req.query.weeks, 8, 52);
            const data = await dashboard_service_1.dashboardService.getWeeklyTrends(req.user.userId, req.user.role, weeks);
            (0, response_1.sendSuccess)(res, data, 'Weekly trends');
        }
        catch (err) {
            next(err);
        }
    },
    async recentActivity(req, res, next) {
        try {
            const limit = parsePositiveInt(req.query.limit, 10, 50);
            const data = await dashboard_service_1.dashboardService.getRecentActivity(req.user.userId, req.user.role, limit);
            (0, response_1.sendSuccess)(res, data, 'Recent activity');
        }
        catch (err) {
            next(err);
        }
    },
    async topCategories(req, res, next) {
        try {
            const limit = parsePositiveInt(req.query.limit, 5, 20);
            const data = await dashboard_service_1.dashboardService.getTopCategories(req.user.userId, req.user.role, limit);
            (0, response_1.sendSuccess)(res, data, 'Top expense categories');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=dashboard.controller.js.map