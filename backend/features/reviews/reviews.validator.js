import { z } from 'zod/v4';
import { REVIEW_VALIDATION } from './reviews.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const notifyNewReviewSchema = z.object({
  reviewId: z
    .string({ required_error: 'El ID de la reseña es requerido' })
    .min(REVIEW_VALIDATION.REVIEW_ID_MIN, 'El ID de la reseña no puede estar vacío'),
  productName: z
    .string({ required_error: 'El nombre del producto es requerido' })
    .min(REVIEW_VALIDATION.PRODUCT_NAME_MIN, 'El nombre del producto no puede estar vacío')
    .max(REVIEW_VALIDATION.PRODUCT_NAME_MAX, `El nombre del producto no puede superar ${REVIEW_VALIDATION.PRODUCT_NAME_MAX} caracteres`),
  productId: z
    .string({ required_error: 'El ID del producto es requerido' })
    .min(REVIEW_VALIDATION.PRODUCT_ID_MIN, 'El ID del producto no puede estar vacío'),
  clientName: z
    .string({ required_error: 'El nombre del cliente es requerido' })
    .min(REVIEW_VALIDATION.CLIENT_NAME_MIN, 'El nombre del cliente no puede estar vacío')
    .max(REVIEW_VALIDATION.CLIENT_NAME_MAX, `El nombre del cliente no puede superar ${REVIEW_VALIDATION.CLIENT_NAME_MAX} caracteres`),
  rating: z
    .number({ required_error: 'El rating es requerido', invalid_type_error: 'El rating debe ser un número' })
    .int('El rating debe ser un número entero')
    .min(REVIEW_VALIDATION.RATING_MIN, `El rating mínimo es ${REVIEW_VALIDATION.RATING_MIN}`)
    .max(REVIEW_VALIDATION.RATING_MAX, `El rating máximo es ${REVIEW_VALIDATION.RATING_MAX}`),
  reviewText: z
    .string({ required_error: 'El texto de la reseña es requerido' })
    .min(REVIEW_VALIDATION.REVIEW_TEXT_MIN, 'El texto de la reseña no puede estar vacío')
    .max(REVIEW_VALIDATION.REVIEW_TEXT_MAX, `El texto de la reseña no puede superar ${REVIEW_VALIDATION.REVIEW_TEXT_MAX} caracteres`),
});

const reviewIdSchema = z.object({
  id: z
    .string({ required_error: 'El ID de la reseña es requerido' })
    .regex(/^\d+$/, 'El ID de la reseña debe ser numérico')
    .max(REVIEW_VALIDATION.ID_MAX, `El ID de la reseña no puede superar ${REVIEW_VALIDATION.ID_MAX} caracteres`),
});

const respondToReviewSchema = z.object({
  responseText: z
    .string({ required_error: 'El campo responseText es requerido' })
    .min(REVIEW_VALIDATION.RESPONSE_TEXT_MIN, `La respuesta debe tener al menos ${REVIEW_VALIDATION.RESPONSE_TEXT_MIN} caracteres`)
    .max(REVIEW_VALIDATION.RESPONSE_TEXT_MAX, `La respuesta no puede superar ${REVIEW_VALIDATION.RESPONSE_TEXT_MAX} caracteres`),
});

const getReviewsSchema = z.object({
  rating: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(5)).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('20'),
  offset: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(0)).optional().default('0'),
});

export const validateNotifyNewReview = (req, res, next) => {
  const result = notifyNewReviewSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateReviewId = (req, res, next) => {
  const result = reviewIdSchema.safeParse(req.params);
  if (!result.success) return responderErrores(res, result.error);
  next();
};

export const validateRespondToReview = (req, res, next) => {
  const result = respondToReviewSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

export const validateGetReviews = (req, res, next) => {
  const result = getReviewsSchema.safeParse(req.query);
  if (!result.success) return responderErrores(res, result.error);
  req.query = result.data;
  next();
};
