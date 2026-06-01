import { Router } from 'express';
import { listar, actualizarEstado } from './custom-orders.controller.js';
import { validateUpdateStatus } from './custom-orders.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, listar);
router.patch('/:id/status', requireAuth, validateUpdateStatus, actualizarEstado);

export default router;
