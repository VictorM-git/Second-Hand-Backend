import { Router } from 'express';
import { getMe, listUsers, setUserStatus, updateMe } from '../controllers/usersController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// Perfil propio: cualquier usuario con sesión
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);

// Gestión de usuarios: solo el administrador
router.get('/', requireAuth, requireRole('admin'), listUsers);
router.patch('/:id/status', requireAuth, requireRole('admin'), setUserStatus);

export default router;
