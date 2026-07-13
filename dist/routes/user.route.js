import { Router } from 'express';
import userController from '../controller/user.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { updateUserSchema } from '../validator/user.schema.js';
const router = Router();
// Routes pour les utilisateurs
router.get('/', requireAdmin, userController.getAll);
router.put('/:id', requireAdmin, validateResource(updateUserSchema), userController.update);
router.delete('/:id', requireAdmin, userController.delete);
export default router;
//# sourceMappingURL=user.route.js.map