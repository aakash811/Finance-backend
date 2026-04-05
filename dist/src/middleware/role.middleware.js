"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireViewer = exports.requireAnalyst = exports.requireAdmin = exports.requireRole = void 0;
const types_1 = require("../types");
const appError_1 = require("../utils/appError");
const ROLE_HIERARCHY = {
    [types_1.Role.VIEWER]: 1,
    [types_1.Role.ANALYST]: 2,
    [types_1.Role.ADMIN]: 3,
};
const requireRole = (...roles) => (req, _res, next) => {
    if (!req.user)
        return next(new appError_1.AppError('Unauthorized', 401));
    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = Math.min(...roles.map((r) => ROLE_HIERARCHY[r]));
    if (userLevel < requiredLevel) {
        return next(new appError_1.AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
    }
    next();
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(types_1.Role.ADMIN);
exports.requireAnalyst = (0, exports.requireRole)(types_1.Role.ANALYST, types_1.Role.ADMIN);
exports.requireViewer = (0, exports.requireRole)(types_1.Role.VIEWER, types_1.Role.ANALYST, types_1.Role.ADMIN);
//# sourceMappingURL=role.middleware.js.map