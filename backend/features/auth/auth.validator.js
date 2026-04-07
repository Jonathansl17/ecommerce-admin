import { z } from 'zod/v4';
import { AUTH_VALIDATION } from './auth.constants.js';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(AUTH_VALIDATION.NOMBRE_MIN, 'El nombre completo es obligatorio')
      .max(AUTH_VALIDATION.NOMBRE_MAX, `El nombre completo no puede exceder ${AUTH_VALIDATION.NOMBRE_MAX} caracteres`),
    email: z
      .string()
      .trim()
      .email('El formato del correo electrónico no es válido')
      .max(AUTH_VALIDATION.CORREO_MAX, `El correo no puede exceder ${AUTH_VALIDATION.CORREO_MAX} caracteres`),
    password: z
      .string()
      .min(AUTH_VALIDATION.CONTRASENA_MIN, `La contraseña debe tener al menos ${AUTH_VALIDATION.CONTRASENA_MIN} caracteres`)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe incluir al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
