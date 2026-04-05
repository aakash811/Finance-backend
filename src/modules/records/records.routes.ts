import { Router } from 'express';
import { recordsController } from './records.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin, requireViewer } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRecordSchema, updateRecordSchema, recordIdSchema, listRecordsSchema } from './records.schemas';

const router: Router = Router();

router.use(authenticate);

// All roles can list and view — service layer enforces ownership scoping
router.get('/',    requireViewer, validate(listRecordsSchema, 'query'), recordsController.list);
router.get('/:id', requireViewer, validate(recordIdSchema, 'params'),   recordsController.getById);

// Only admin can create, update, delete
router.post('/',   requireAdmin, validate(createRecordSchema),          recordsController.create);
router.patch('/:id', requireAdmin,
  validate(recordIdSchema, 'params'), validate(updateRecordSchema),     recordsController.update);
router.delete('/:id', requireAdmin,
  validate(recordIdSchema, 'params'),                                   recordsController.remove);

export default router;