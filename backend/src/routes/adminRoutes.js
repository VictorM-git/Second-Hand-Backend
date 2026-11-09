import { Router } from 'express';
import { getStats } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/stats', requireAuth, requireRole('admin'), getStats);

export default router;
