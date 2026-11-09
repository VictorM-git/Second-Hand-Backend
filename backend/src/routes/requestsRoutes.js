import { Router } from 'express';
import {
  createRequest, deleteReceivedRequest, getMyRequest, listMyRequests, listReceivedRequests, respondToRequest,
} from '../controllers/requestsController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas de solicitudes son de usuarios de la comunidad
router.use(requireAuth, requireRole('user'));

router.get('/', listMyRequests);
router.post('/', createRequest);
router.get('/received', listReceivedRequests); // va antes de /:id
router.get('/:id', getMyRequest);
router.patch('/:id', respondToRequest);
router.delete('/:id', deleteReceivedRequest);

export default router;
