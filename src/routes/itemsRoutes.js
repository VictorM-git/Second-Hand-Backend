import { Router } from 'express';
import {
  createItem, getItem, listItems, listMyItems, setItemStatus, updateItem,
} from '../controllers/itemsController.js';
import { optionalAuth, requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// Consulta pública (la landing muestra los recientes sin sesión). Con token se marca "mine".
router.get('/', optionalAuth, listItems);

// Publicaciones propias: solo usuarios (no el administrador). /mine va antes de /:id
router.get('/mine', requireAuth, requireRole('user'), listMyItems);
router.get('/:id', optionalAuth, getItem);
router.post('/', requireAuth, requireRole('user'), createItem);
router.put('/:id', requireAuth, requireRole('user'), updateItem);
router.patch('/:id/status', requireAuth, requireRole('user'), setItemStatus);

export default router;
