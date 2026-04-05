"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const swagger_1 = require("./config/swagger");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const records_routes_1 = __importDefault(require("./modules/records/records.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const app = (0, express_1.default)();
// Security & parsing
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logging (skip in test env)
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined'));
}
// Rate limiting
app.use(rateLimiter_middleware_1.globalRateLimiter);
// Health check
app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Finance API is running', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/records', records_routes_1.default);
app.use('/api/v1/dashboard', dashboard_routes_1.default);
// Swagger docs
(0, swagger_1.setupSwagger)(app);
// 404 + global error handler
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map