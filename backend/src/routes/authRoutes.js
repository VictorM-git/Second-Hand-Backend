import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

// Rutas públicas de autenticación
const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
