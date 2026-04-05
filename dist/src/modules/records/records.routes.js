"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const records_controller_1 = require("./records.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const records_schemas_1 = require("./records.schemas");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// All roles can list and view — service layer enforces ownership scoping
router.get('/', role_middleware_1.requireViewer, (0, validate_middleware_1.validate)(records_schemas_1.listRecordsSchema, 'query'), records_controller_1.recordsController.list);
router.get('/:id', role_middleware_1.requireViewer, (0, validate_middleware_1.validate)(records_schemas_1.recordIdSchema, 'params'), records_controller_1.recordsController.getById);
// Only admin can create, update, delete
router.post('/', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(records_schemas_1.createRecordSchema), records_controller_1.recordsController.create);
router.patch('/:id', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(records_schemas_1.recordIdSchema, 'params'), (0, validate_middleware_1.validate)(records_schemas_1.updateRecordSchema), records_controller_1.recordsController.update);
router.delete('/:id', role_middleware_1.requireAdmin, (0, validate_middleware_1.validate)(records_schemas_1.recordIdSchema, 'params'), records_controller_1.recordsController.remove);
exports.default = router;
//# sourceMappingURL=records.routes.js.map