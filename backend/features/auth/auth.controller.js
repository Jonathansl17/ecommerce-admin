import { register as registerService, iniciarSesion as iniciarSesionService } from './auth.service.js';
import { registerSchema } from './auth.validator.js';
import { AUTH_MESSAGES } from './auth.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const register = async (req, res, next) => {
  try {
    const resultado = registerSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        errors: resultado.error.flatten().fieldErrors,
      });
    }

    const { fullName, email, password } = resultado.data;
    const usuario = await registerService({ fullName, email, password });

    return res.status(HTTP_STATUS.CREATED).json({
      message: AUTH_MESSAGES.REGISTRO_EXITOSO,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const resultado = await iniciarSesionService({ email, password });

    return res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.INICIO_SESION_EXITOSO,
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
};
