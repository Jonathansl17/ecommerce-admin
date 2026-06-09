import rateLimit from 'express-rate-limit';

const errorResponse = (_req, res) => {
  res.status(429).json({ data: null, error: 'Demasiadas solicitudes, intente más tarde', meta: null });
};

export const inventoryWriteRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: errorResponse,
});

export const webhookRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: errorResponse,
});

export const adminWriteRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: errorResponse,
});
