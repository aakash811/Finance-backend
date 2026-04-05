"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta) => {
    const payload = { success: true, message, data };
    if (meta)
        payload.meta = meta;
    return res.status(statusCode).json(payload);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400, errors) => {
    const payload = { success: false, message };
    if (errors)
        payload['errors'] = errors;
    return res.status(statusCode).json(payload);
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map