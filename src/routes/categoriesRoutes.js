import { Router } from 'express';
import {
  createCategory, listCategories, setCategoryStatus, updateCategory,
} from '../controllers/categoriesController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// Consulta pública (Explorar y Publicar usan las activas: ?status=Activa)
router.get('/', listCategories);

// Gestión: solo el administrador
router.post('/', requireAuth, requireRole('admin'), createCategory);
router.put('/:id', requireAuth, requireRole('admin'), updateCategory);
router.patch('/:id/status', requireAuth, requireRole('admin'), setCategoryStatus);

export default router;
