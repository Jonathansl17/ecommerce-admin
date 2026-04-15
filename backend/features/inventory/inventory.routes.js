import { Router } from 'express';
import { getAll, create, update, createEntry, createConsumption } from './inventory.controller.js';
import { validateCreateSupply, validateUpdateSupply, validateCreateEntry, validateCreateConsumption } from './inventory.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/supplies', getAll);
router.post('/supplies', validateCreateSupply, create);
router.put('/supplies/:id', validateUpdateSupply, update);
router.post('/supplies/:id/entries', requireAuth, validateCreateEntry, createEntry);
router.post('/consumption', requireAuth, validateCreateConsumption, createConsumption);

export default router;
