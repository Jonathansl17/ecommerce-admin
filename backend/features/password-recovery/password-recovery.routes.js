import { Router } from 'express';
import {
  requestPasswordRecovery,
  resetRecoveredPassword,
  validateRecoveryToken,
} from './password-recovery.controller.js';
import {
  validatePasswordRecoveryRequest,
  validatePasswordRecoveryToken,
  validatePasswordReset,
} from './password-recovery.validator.js';

const router = Router();

router.post('/request', validatePasswordRecoveryRequest, requestPasswordRecovery);
router.post('/validate-token', validatePasswordRecoveryToken, validateRecoveryToken);
router.post('/reset', validatePasswordReset, resetRecoveredPassword);

export default router;
