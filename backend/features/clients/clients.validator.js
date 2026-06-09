import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número entero positivo'),
});

const createClientSchema = z.object({
  fullName: z.string().trim().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres'),
  email: z.string().trim().toLowerCase().email('Correo electrónico inválido').max(150, 'El correo no puede superar 150 caracteres'),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres')
    .max(128, 'La contraseña no puede superar 128 caracteres'),
}).strict();

const updateClientSchema = z.object({
  fullName: z.string().trim().min(1, 'El nombre es requerido').max(100, 'El nombre no puede superar 100 caracteres').optional(),
  email: z.string().trim().toLowerCase().email('Correo electrónico inválido').max(150, 'El correo no puede superar 150 caracteres').optional(),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres')
    .max(128, 'La contraseña no puede superar 128 caracteres')
    .optional(),
  accountStatus: z.enum(['active', 'inactive', 'deleted']).optional(),
}).strict().refine((data) => Object.keys(data).length > 0, { message: 'Debe enviar al menos un campo para actualizar' });

export const validateClientId = (req, res, next) => {
  const result = idParamSchema.safeParse(req.params);
  if (!result.success) {
    const message = result.error.issues?.[0]?.message ?? 'ID inválido';
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ data: null, error: message, meta: null });
  }
  next();
};

export const validateCreateClient = (req, res, next) => {
  const result = createClientSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues?.[0]?.message ?? 'Datos inválidos';
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ data: null, error: message, meta: null });
  }
  req.body = result.data;
  next();
};

export const validateUpdateClient = (req, res, next) => {
  const result = updateClientSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues?.[0]?.message ?? 'Datos inválidos';
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ data: null, error: message, meta: null });
  }
  req.body = result.data;
  next();
};
