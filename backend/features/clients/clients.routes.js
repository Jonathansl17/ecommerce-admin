import { Router } from 'express';
import { getAll, getById, create, update, remove } from './clients.controller.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';
import { validateClientId, validateCreateClient, validateUpdateClient } from './clients.validator.js';
import { adminWriteRateLimit } from '../../shared/middleware/rateLimitMiddleware.js';

const ADMIN_ROLES = ['administrador'];
const router = Router();

router.use(requireAuth, requireRole(ADMIN_ROLES));
router.get('/', getAll);
router.get('/:id', validateClientId, getById);
router.post('/', adminWriteRateLimit, validateCreateClient, create);
router.put('/:id', adminWriteRateLimit, validateClientId, validateUpdateClient, update);
router.delete('/:id', adminWriteRateLimit, validateClientId, remove);

export default router;
