import { Router } from 'express';
import creationController from '../controller/creation.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
const router = Router();
// ==================== FRUITS ====================
router.get('/fruits', creationController.getFruits);
router.get('/fruits/:id', creationController.getFruitById);
router.post('/fruits', requireAdmin, creationController.createFruit);
router.put('/fruits/:id', requireAdmin, creationController.updateFruit);
router.delete('/fruits/:id', requireAdmin, creationController.deleteFruit);
// ==================== SAUCES ====================
router.get('/sauces', creationController.getSauces);
router.get('/sauces/:id', creationController.getSauceById);
router.post('/sauces', requireAdmin, creationController.createSauce);
router.put('/sauces/:id', requireAdmin, creationController.updateSauce);
router.delete('/sauces/:id', requireAdmin, creationController.deleteSauce);
// ==================== CÉRÉALES ====================
router.get('/cereales', creationController.getCereales);
router.get('/cereales/:id', creationController.getCerealeById);
router.post('/cereales', requireAdmin, creationController.createCereale);
router.put('/cereales/:id', requireAdmin, creationController.updateCereale);
router.delete('/cereales/:id', requireAdmin, creationController.deleteCereale);
// ==================== TAILLES ====================
router.get('/tailles', creationController.getTailles);
router.get('/tailles/:id', creationController.getTailleById);
router.post('/tailles', requireAdmin, creationController.createTaille);
router.put('/tailles/:id', requireAdmin, creationController.updateTaille);
router.delete('/tailles/:id', requireAdmin, creationController.deleteTaille);
export default router;
//# sourceMappingURL=creation.route.js.map