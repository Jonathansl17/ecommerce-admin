import { z } from 'zod/v4';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { REVIEW_VALIDATION } from './reviews.constants.js';

const responderErrores = (res, error) => {
  const errores = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errores });
};

const notifyNewReviewSchema = z.object({
  reviewId: z
    .string({ required_error: 'El ID de la reseña es requerido' })
    .min(REVIEW_VALIDATION.REVIEW_ID_MIN, 'El ID de la reseña no puede estar vacío'),
  productName: z
    .string({ required_error: 'El nombre del producto es requerido' })
    .min(REVIEW_VALIDATION.PRODUCT_NAME_MIN, 'El nombre del producto no puede estar vacío')
    .max(
      REVIEW_VALIDATION.PRODUCT_NAME_MAX,
      `El nombre del producto no puede superar ${REVIEW_VALIDATION.PRODUCT_NAME_MAX} caracteres`
    ),
  productId: z
    .string({ required_error: 'El ID del producto es requerido' })
    .min(1, 'El ID del producto no puede estar vacío'),
  clientName: z
    .string({ required_error: 'El nombre del cliente es requerido' })
    .min(REVIEW_VALIDATION.CLIENT_NAME_MIN, 'El nombre del cliente no puede estar vacío')
    .max(
      REVIEW_VALIDATION.CLIENT_NAME_MAX,
      `El nombre del cliente no puede superar ${REVIEW_VALIDATION.CLIENT_NAME_MAX} caracteres`
    ),
  rating: z
    .number({ required_error: 'La calificación es requerida' })
    .int('La calificación debe ser un número entero')
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5'),
  reviewText: z
    .string({ required_error: 'El texto de la reseña es requerido' })
    .min(1, 'El texto de la reseña no puede estar vacío')
    .max(
      REVIEW_VALIDATION.REVIEW_TEXT_MAX,
      `El texto de la reseña no puede superar ${REVIEW_VALIDATION.REVIEW_TEXT_MAX} caracteres`
    ),
});

export const validateNotifyNewReview = (req, res, next) => {
  const result = notifyNewReviewSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
