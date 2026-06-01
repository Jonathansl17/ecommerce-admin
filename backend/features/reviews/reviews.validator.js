import { z } from 'zod/v4';
import {
  MODERATION_REASON_CODES,
  REVIEW_VALIDATION,
  REVIEW_VALIDATION_MESSAGES,
} from './reviews.constants.js';
import { responderErrores } from '../../shared/middleware/validatorUtils.js';

const MODERATION_REASONS = MODERATION_REASON_CODES;

const notifyNewReviewSchema = z.object({
  reviewId: z
    .string({ required_error: 'El ID de la reseña es requerido' })
    .min(REVIEW_VALIDATION.REVIEW_ID_MIN, 'El ID de la reseña no puede estar vacío')
    .max(100, 'El ID de la reseña no puede superar 100 caracteres'),
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

export const validateNotifyNewReview = (req, res, next) => {
  const result = notifyNewReviewSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

const respondToReviewSchema = z.object({
  responseText: z
    .string({ required_error: REVIEW_VALIDATION_MESSAGES.RESPONSE_REQUIRED })
    .min(REVIEW_VALIDATION.RESPONSE_TEXT_MIN, REVIEW_VALIDATION_MESSAGES.RESPONSE_MIN)
    .max(REVIEW_VALIDATION.RESPONSE_TEXT_MAX, REVIEW_VALIDATION_MESSAGES.RESPONSE_MAX),
});

export const validateRespondToReview = (req, res, next) => {
  const result = respondToReviewSchema.safeParse(req.body);
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

const rejectReviewSchema = z.object({
  reason: z.enum(MODERATION_REASONS, { error: REVIEW_VALIDATION_MESSAGES.REASON_INVALID }).optional(),
  notes: z.string().max(REVIEW_VALIDATION.NOTES_MAX, REVIEW_VALIDATION_MESSAGES.NOTES_MAX).optional(),
});

export const validateRejectReview = (req, res, next) => {
  const result = rejectReviewSchema.safeParse(req.body ?? {});
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};

const deleteReviewSchema = z.object({
  reason: z.enum(MODERATION_REASONS, {
    error: (issue) =>
      issue.input === undefined
        ? REVIEW_VALIDATION_MESSAGES.DELETE_REASON_REQUIRED
        : REVIEW_VALIDATION_MESSAGES.DELETE_REASON_INVALID,
  }),
  detail: z
    .string()
    .trim()
    .max(REVIEW_VALIDATION.DELETE_DETAIL_MAX, REVIEW_VALIDATION_MESSAGES.DELETE_DETAIL_MAX)
    .optional(),
});

export const validateDeleteReview = (req, res, next) => {
  const result = deleteReviewSchema.safeParse(req.body ?? {});
  if (!result.success) return responderErrores(res, result.error);
  req.body = result.data;
  next();
};
