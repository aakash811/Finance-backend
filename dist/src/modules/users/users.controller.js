"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const users_service_1 = require("./users.service");
const response_1 = require("../../utils/response");
const audit_1 = require("../../utils/audit");
exports.usersController = {
    async list(req, res, next) {
        try {
            const result = await users_service_1.usersService.list(req.query);
            (0, response_1.sendSuccess)(res, result.users, 'Users fetched', 200, {
                page: result.page, limit: result.limit,
                total: result.total, totalPages: result.totalPages,
            });
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const user = await users_service_1.usersService.getById(req.params.id);
            (0, response_1.sendSuccess)(res, user, 'User fetched');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const user = await users_service_1.usersService.create(req.body);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'CREATE', resource: 'USER', resourceId: user.id, req });
            (0, response_1.sendSuccess)(res, user, 'User created', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const user = await users_service_1.usersService.update(req.params.id, req.body);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'UPDATE', resource: 'USER', resourceId: req.params.id,
                changes: req.body, req });
            (0, response_1.sendSuccess)(res, user, 'User updated');
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await users_service_1.usersService.softDelete(req.params.id, req.user.userId);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'DELETE', resource: 'USER', resourceId: req.params.id, req });
            (0, response_1.sendSuccess)(res, null, 'User deleted');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=users.controller.js.map