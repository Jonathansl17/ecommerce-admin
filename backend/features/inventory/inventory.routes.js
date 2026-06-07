import { Router } from 'express';
import { getAll, create, update, deleteSupply, createEntry, createEntries, createConsumption, getMovements, getReport } from './inventory.controller.js';
import { validateCreateSupply, validateUpdateSupply, validateCreateEntry, validateCreateEntries, validateCreateConsumption, validateReportQuery, validateMovementsQuery } from './inventory.validator.js';
import { requireAuth, requireRole } from '../../shared/middleware/authMiddleware.js';

const ADMIN_ROLES = ['administrador'];

const router = Router();

router.get('/supplies', requireAuth, requireRole(ADMIN_ROLES), getAll);
router.post('/supplies', requireAuth, requireRole(ADMIN_ROLES), validateCreateSupply, create);
router.put('/supplies/:id', requireAuth, requireRole(ADMIN_ROLES), validateUpdateSupply, update);
router.delete('/supplies/:id', requireAuth, requireRole(ADMIN_ROLES), deleteSupply);
router.post('/supplies/:id/entries', requireAuth, requireRole(ADMIN_ROLES), validateCreateEntry, createEntry);
router.post('/entries', requireAuth, requireRole(ADMIN_ROLES), validateCreateEntries, createEntries);
router.post('/consumption', requireAuth, requireRole(ADMIN_ROLES), validateCreateConsumption, createConsumption);
router.get('/supplies/:id/movements', requireAuth, requireRole(ADMIN_ROLES), validateMovementsQuery, getMovements);
router.get('/report', requireAuth, requireRole(ADMIN_ROLES), validateReportQuery, getReport);

export default router;
