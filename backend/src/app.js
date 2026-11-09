import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { openapi } from './docs/openapi.js';
import { errorHandler, notFound } from './middlewares/errors.js';
import { logger } from './middlewares/logger.js';
import apiRoutes from './routes/index.js';

// Configuración de la aplicación Express (sin abrir el puerto: eso lo hace server.js)
const app = express();

// Registro de cada petición en consola (primero, para que también registre las rechazadas por CORS o JSON inválido)
app.use(logger);

// CORS: solo el frontend autorizado (por defecto http://localhost:5173, el puerto de Vite).
// Se expone X-Total-Count para que el frontend pueda leer el total de resultados de GET /api/items.
app.use(cors({ origin: env.corsOrigins, exposedHeaders: ['X-Total-Count'] }));

// Cuerpo JSON. El límite cubre una foto de 5 MB enviada como data URL (base64).
app.use(express.json({ limit: '8mb' }));

// Documentación Swagger
app.get('/', (req, res) => res.redirect('/api/docs'));
app.get('/api/docs.json', (req, res) => res.json(openapi));
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapi, {
    customSiteTitle: 'Second Hand API · Swagger',
    swaggerOptions: { persistAuthorization: true },
  })
);

// Rutas de la API
app.use('/api', apiRoutes);

// Rutas inexistentes y manejo central de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

export default app;
