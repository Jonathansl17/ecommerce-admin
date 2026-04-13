import { Router } from 'express';
import { getAll, create } from './inventory.controller.js';
import { validateCreateSupply } from './inventory.validator.js';

const router = Router();

router.get('/supplies', getAll);
router.post('/supplies', validateCreateSupply, create);

export default router;
