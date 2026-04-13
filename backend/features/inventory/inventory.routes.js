import { Router } from 'express';
import { getAll, create, update } from './inventory.controller.js';
import { validateCreateSupply, validateUpdateSupply } from './inventory.validator.js';

const router = Router();

router.get('/supplies', getAll);
router.post('/supplies', validateCreateSupply, create);
router.put('/supplies/:id', validateUpdateSupply, update);

export default router;
