import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { authRateLimiter } from '../../middleware/rateLimiter.middleware';
import { registerSchema, loginSchema, refreshSchema } from './auth.schemas';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login',    authRateLimiter, validate(loginSchema),    authController.login);
router.post('/refresh',  validate(refreshSchema),                   authController.refresh);
router.post('/logout',   authenticate,                              authController.logout);
router.get('/me',        authenticate,                              authController.me);

export default router;