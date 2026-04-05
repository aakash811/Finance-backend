"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const users_schemas_1 = require("./users.schemas");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(users_schemas_1.listUsersSchema, 'query'), users_controller_1.usersController.list);
router.get('/:id', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(users_schemas_1.userIdSchema, 'params'), users_controller_1.usersController.getById);
router.post('/', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(users_schemas_1.createUserSchema), users_controller_1.usersController.create);
router.patch('/:id', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(users_schemas_1.userIdSchema, 'params'), (0, validate_middleware_1.validate)(users_schemas_1.updateUserSchema), users_controller_1.usersController.update);
router.delete('/:id', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(users_schemas_1.userIdSchema, 'params'), users_controller_1.usersController.remove);
exports.default = router;
//# sourceMappingURL=users.routes.js.map