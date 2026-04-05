"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
exports.authController = {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            (0, response_1.sendSuccess)(res, result, 'Registered successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            (0, response_1.sendSuccess)(res, result, 'Logged in successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refresh(refreshToken);
            (0, response_1.sendSuccess)(res, result, 'Token refreshed');
        }
        catch (err) {
            next(err);
        }
    },
    async logout(req, res, next) {
        try {
            await auth_service_1.authService.logout(req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async me(req, res, next) {
        try {
            (0, response_1.sendSuccess)(res, req.user, 'Current user');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map