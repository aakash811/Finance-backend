"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordsController = void 0;
const records_service_1 = require("./records.service");
const response_1 = require("../../utils/response");
const audit_1 = require("../../utils/audit");
exports.recordsController = {
    async list(req, res, next) {
        try {
            const result = await records_service_1.recordsService.list(req.query, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, result.records, 'Records fetched', 200, {
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
            const record = await records_service_1.recordsService.getById(req.params.id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, record, 'Record fetched');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const record = await records_service_1.recordsService.create(req.body, req.user.userId);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'CREATE', resource: 'RECORD', resourceId: record.id, req });
            (0, response_1.sendSuccess)(res, record, 'Record created', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const record = await records_service_1.recordsService.update(req.params.id, req.body, req.user.userId, req.user.role);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'UPDATE', resource: 'RECORD', resourceId: req.params.id,
                changes: req.body, req });
            (0, response_1.sendSuccess)(res, record, 'Record updated');
        }
        catch (err) {
            next(err);
        }
    },
    async remove(req, res, next) {
        try {
            await records_service_1.recordsService.softDelete(req.params.id, req.user.userId, req.user.role);
            await (0, audit_1.audit)({ userId: req.user.userId, userEmail: req.user.email,
                action: 'DELETE', resource: 'RECORD', resourceId: req.params.id, req });
            (0, response_1.sendSuccess)(res, null, 'Record deleted');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=records.controller.js.map