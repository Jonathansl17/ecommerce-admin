import { Router } from 'express';
import { getAll, create, update, createEntry, createEntries, createConsumption, getMovements, getReport } from './inventory.controller.js';
import { validateCreateSupply, validateUpdateSupply, validateCreateEntry, validateCreateEntries, validateCreateConsumption, validateReportQuery, validateMovementsQuery } from './inventory.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/supplies', requireAuth, getAll);
router.post('/supplies', requireAuth, validateCreateSupply, create);
router.put('/supplies/:id', requireAuth, validateUpdateSupply, update);
router.post('/supplies/:id/entries', requireAuth, validateCreateEntry, createEntry);
router.post('/entries', requireAuth, validateCreateEntries, createEntries);
router.post('/consumption', requireAuth, validateCreateConsumption, createConsumption);
router.get('/supplies/:id/movements', requireAuth, validateMovementsQuery, getMovements);
router.get('/report', requireAuth, validateReportQuery, getReport);

export default router;
