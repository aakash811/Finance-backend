"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error('Unhandled error', {
        message: err.message,
        stack: env_1.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });
    if (err instanceof appError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    // Postgres unique constraint
    if (err.code === '23505') {
        res.status(409).json({ success: false, message: 'Resource already exists' });
        return;
    }
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(env_1.env.NODE_ENV === 'development' && { detail: err.message }),
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map