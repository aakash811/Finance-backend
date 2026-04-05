"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = void 0;
const auditLog_1 = require("../models/auditLog");
const logger_1 = require("./logger");
const mongoose_1 = __importDefault(require("mongoose"));
const audit = async (params) => {
    if (mongoose_1.default.connection.readyState !== 1)
        return;
    try {
        await auditLog_1.AuditLog.create({
            userId: params.userId,
            userEmail: params.userEmail,
            action: params.action,
            resource: params.resource,
            resourceId: params.resourceId,
            changes: params.changes,
            success: params.success ?? true,
            errorMessage: params.errorMessage,
            ipAddress: params.req?.ip,
            userAgent: params.req?.get('user-agent'),
        });
    }
    catch (err) {
        logger_1.logger.warn('Audit log write failed', { err });
    }
};
exports.audit = audit;
//# sourceMappingURL=audit.js.map