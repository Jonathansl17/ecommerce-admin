import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productsRoutes from './features/products/products.routes.js';
import clientsRoutes from './features/clients/clients.routes.js';
import authRoutes from './features/auth/auth.routes.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { APP_CONFIG } from './shared/constants/app.constants.js';

const app = express();
const PORT = process.env.PORT || APP_CONFIG.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
