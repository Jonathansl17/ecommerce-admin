import { z } from 'zod/v4';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const requestSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .trim()
    .email('Debe ingresar un correo electrónico válido'),
});

const tokenSchema = z.object({
  token: z
    .string({ required_error: 'El token es requerido' })
    .trim()
    .min(1, 'El token es requerido'),
});

const resetSchema = tokenSchema
  .extend({
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string({ required_error: 'La confirmación de contraseña es requerida' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const validatePasswordRecoveryRequest = (req, res, next) => {
  const resultado = requestSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado.error);
  }

  req.body = resultado.data;
  next();
};

export const validatePasswordRecoveryToken = (req, res, next) => {
  const resultado = tokenSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado.error);
  }

  req.body = resultado.data;
  next();
};

export const validatePasswordReset = (req, res, next) => {
  const resultado = resetSchema.safeParse(req.body);
  if (!resultado.success) {
    return responderErrores(res, resultado.error);
  }

  req.body = resultado.data;
  next();
};
