import { Router } from 'express';
import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { Request } from '../models/Request.js';
import { User } from '../models/User.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import itemsRoutes from './itemsRoutes.js';
import requestsRoutes from './requestsRoutes.js';
import usersRoutes from './usersRoutes.js';

// Todas las rutas de la API cuelgan de /api
const router = Router();

// Ruta de prueba: confirma que el servidor responde y cuántos registros hay en memoria
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    storage: 'memoria',
    data: {
      users: User.all().length,
      categories: Category.all().length,
      items: Item.all().length,
      requests: Request.all().length,
    },
    time: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/items', itemsRoutes);
router.use('/requests', requestsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/admin', adminRoutes);

export default router;
