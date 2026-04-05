"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rateLimiter_middleware_1 = require("../../middleware/rateLimiter.middleware");
const auth_schemas_1 = require("./auth.schemas");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_middleware_1.authRateLimiter, (0, validate_middleware_1.validate)(auth_schemas_1.registerSchema), auth_controller_1.authController.register);
router.post('/login', rateLimiter_middleware_1.authRateLimiter, (0, validate_middleware_1.validate)(auth_schemas_1.loginSchema), auth_controller_1.authController.login);
router.post('/refresh', (0, validate_middleware_1.validate)(auth_schemas_1.refreshSchema), auth_controller_1.authController.refresh);
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.authController.logout);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map