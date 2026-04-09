import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { validateLogin } from './auth.login.validator.js';

const router = Router();

router.post('/register', register);
router.post('/login', validateLogin, login);

export default router;
