import { Router } from 'express';
import specialServiceController from '../controller/specialService.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';

const router: Router = Router();

// Public : services actifs pour le catalogue
router.get('/', specialServiceController.getActive);

// Admin : gestion des services et de leurs composants
router.get('/all', requireAdmin, specialServiceController.getAll);
router.put('/components/:componentId', requireAdmin, specialServiceController.updateComposant);
router.delete('/components/:componentId', requireAdmin, specialServiceController.deleteComposant);
router.post('/:id/components', requireAdmin, specialServiceController.addComposant);
router.put('/:id', requireAdmin, specialServiceController.update);

export default router;
