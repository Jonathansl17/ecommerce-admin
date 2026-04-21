import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { AUTH_CONFIG } from '../auth/auth.constants.js';
import {
  restablecerPassword,
  solicitarRecuperacionPassword,
  validarTokenRecuperacionPassword,
} from './password-recovery.service.js';

export const requestPasswordRecovery = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resultado = await solicitarRecuperacionPassword({
      email,
      saltRounds: AUTH_CONFIG.SALT_ROUNDS,
    });

    return res.status(HTTP_STATUS.OK).json({ message: resultado.message });
  } catch (error) {
    next(error);
  }
};

export const validateRecoveryToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    await validarTokenRecuperacionPassword(token);

    return res.status(HTTP_STATUS.OK).json({ message: 'OK' });
  } catch (error) {
    next(error);
  }
};

export const resetRecoveredPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resultado = await restablecerPassword({
      token,
      password,
      saltRounds: AUTH_CONFIG.SALT_ROUNDS,
    });

    return res.status(HTTP_STATUS.OK).json({ message: resultado.message });
  } catch (error) {
    next(error);
  }
};
