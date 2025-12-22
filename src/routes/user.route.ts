import { Router } from 'express';
import userController from '../controller/user.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';

const router: Router = Router();

// Routes pour les utilisateurs
router.get('/', requireAdmin, userController.getAll);
router.put('/:id', requireAdmin, userController.update);
router.delete('/:id', requireAdmin, userController.delete);

export default router;