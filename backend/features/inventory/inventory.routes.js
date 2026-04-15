import { Router } from 'express';
import { getAll, create, update, createEntry, createEntries, createConsumption, getMovements, getReport } from './inventory.controller.js';
import { validateCreateSupply, validateUpdateSupply, validateCreateEntry, validateCreateEntries, validateCreateConsumption } from './inventory.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/supplies', getAll);
router.post('/supplies', validateCreateSupply, create);
router.put('/supplies/:id', validateUpdateSupply, update);
router.post('/supplies/:id/entries', requireAuth, validateCreateEntry, createEntry);
router.post('/entries', requireAuth, validateCreateEntries, createEntries);
router.post('/consumption', requireAuth, validateCreateConsumption, createConsumption);
router.get('/supplies/:id/movements', getMovements);
router.get('/report', getReport);

export default router;
