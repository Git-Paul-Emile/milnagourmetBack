import { Router } from 'express';
import deliveryZoneController from '../controller/deliveryZone.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';

const router: Router = Router();

// Routes pour les zones de livraison
router.get('/', deliveryZoneController.getAll);
router.get('/active', deliveryZoneController.getAllActive);
router.get('/with-orders', deliveryZoneController.getAllWithOrderCounts);
router.get('/:id', deliveryZoneController.getById);
router.post('/', requireAdmin, deliveryZoneController.create);
router.put('/:id', requireAdmin, deliveryZoneController.update);
router.delete('/:id', requireAdmin, deliveryZoneController.delete);

export default router;