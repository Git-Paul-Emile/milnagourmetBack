import { Router } from 'express';
import deliveryPersonController from '../controller/deliveryPerson.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
const router = Router();
// Routes pour les livreurs
router.get('/', requireAdmin, deliveryPersonController.getAll);
router.get('/:id', requireAdmin, deliveryPersonController.getById);
router.post('/', requireAdmin, deliveryPersonController.create);
router.put('/:id', requireAdmin, deliveryPersonController.update);
router.delete('/:id', requireAdmin, deliveryPersonController.delete);
export default router;
//# sourceMappingURL=deliveryPerson.route.js.map