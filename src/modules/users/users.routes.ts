import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireAdmin } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, userIdSchema, listUsersSchema } from './users.schemas';

const router = Router();

router.use(authenticate);

router.get('/',    requireAdmin, validate(listUsersSchema, 'query'), usersController.list);
router.get('/:id', requireAdmin, validate(userIdSchema, 'params'),  usersController.getById);
router.post('/',   requireAdmin, validate(createUserSchema),         usersController.create);
router.patch('/:id', requireAdmin,
  validate(userIdSchema, 'params'), validate(updateUserSchema), usersController.update);
router.delete('/:id', requireAdmin,
  validate(userIdSchema, 'params'), usersController.remove);

export default router;