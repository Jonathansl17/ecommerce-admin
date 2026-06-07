import { Router } from 'express';
import { getAll, getById, create, update, remove } from './clients.controller.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';

const ADMIN_ROLES = ['administrador'];
const router = Router();

router.use(requireAuth, requireRole(ADMIN_ROLES));
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
