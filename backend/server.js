import 'dotenv/config';
import { validateEnv } from './shared/config/validateEnv.js';
validateEnv();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { limpiarTokensExpirados } from './features/auth/auth.tokens.service.js';
import productsRoutes, { productImagesPublicRouter } from './features/products/products.routes.js';
import clientsRoutes from './features/clients/clients.routes.js';
import storeUsersRoutes from './features/clients/store-users.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import passwordRecoveryRoutes from './features/password-recovery/password-recovery.routes.js';
import inventoryRoutes from './features/inventory/inventory.routes.js';
import notificationsRoutes from './features/notifications/notifications.routes.js';
import { ordersWebhookRouter, ordersAdminRouter } from './features/orders/orders.routes.js';
import { reviewsWebhookRouter, reviewsAdminRouter } from './features/reviews/reviews.routes.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { requireFetchHeader } from './shared/middleware/csrfMiddleware.js';
import { APP_CONFIG } from './shared/constants/app.constants.js';

const app = express();
const PORT = process.env.PORT || APP_CONFIG.PORT;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:4000';

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// Routes exempt from CSRF header check are registered before requireFetchHeader.
// /api/orders/notify is a webhook-style POST called by the external client app —
// it won't send the x-requested-with header that browsers inject via fetch.
// The admin-facing /api/orders routes are mounted after requireFetchHeader below
// so they require both the CSRF header and admin auth (applied per-route).
// Notification GET routes (including SSE /stream) are safe methods and would
// pass the CSRF check regardless, but they are grouped with this block for clarity.
app.use('/api/orders', ordersWebhookRouter);
app.use('/api/reviews', reviewsWebhookRouter);
app.use('/api/products', productImagesPublicRouter);

app.use(requireFetchHeader);

app.use('/api/orders', ordersAdminRouter);
app.use('/api/products', productsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/store-users', storeUsersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/password-recovery', passwordRecoveryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reviews', reviewsAdminRouter);

app.use(errorHandler);

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  setInterval(async () => {
    try {
      const count = await limpiarTokensExpirados();
      if (count > 0) console.log(`Tokens expirados eliminados: ${count}`);
    } catch (error) {
      console.error('Error limpiando tokens expirados:', error);
    }
  }, CLEANUP_INTERVAL_MS);
});
