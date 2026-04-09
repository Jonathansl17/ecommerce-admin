import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Debe ingresar un correo electrónico válido'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, 'La contraseña es requerida'),
});

export const validateLogin = (req, res, next) => {
  const resultado = loginSchema.safeParse(req.body);

  if (!resultado.success) {
    const errores = resultado.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
  }

  req.body = resultado.data;
  next();
};
