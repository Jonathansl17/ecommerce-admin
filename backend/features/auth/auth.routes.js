import { Router } from 'express';
import { register, login, logout } from './auth.controller.js';
import { validateLogin } from './auth.login.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', validateLogin, login);
router.post('/logout', requireAuth, logout);

export default router;
