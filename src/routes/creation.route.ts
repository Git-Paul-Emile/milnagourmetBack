import { Router } from 'express';
import creationController from '../controller/creation.controller.js';

const router = Router();

// ==================== FRUITS ====================
router.get('/fruits', creationController.getFruits);
router.get('/fruits/:id', creationController.getFruitById);
router.post('/fruits', creationController.createFruit);
router.put('/fruits/:id', creationController.updateFruit);
router.delete('/fruits/:id', creationController.deleteFruit);

// ==================== SAUCES ====================
router.get('/sauces', creationController.getSauces);
router.get('/sauces/:id', creationController.getSauceById);
router.post('/sauces', creationController.createSauce);
router.put('/sauces/:id', creationController.updateSauce);
router.delete('/sauces/:id', creationController.deleteSauce);

// ==================== CÉRÉALES ====================
router.get('/cereales', creationController.getCereales);
router.get('/cereales/:id', creationController.getCerealeById);
router.post('/cereales', creationController.createCereale);
router.put('/cereales/:id', creationController.updateCereale);
router.delete('/cereales/:id', creationController.deleteCereale);

// ==================== TAILLES ====================
router.get('/tailles', creationController.getTailles);
router.get('/tailles/:id', creationController.getTailleById);
router.post('/tailles', creationController.createTaille);
router.put('/tailles/:id', creationController.updateTaille);
router.delete('/tailles/:id', creationController.deleteTaille);

export default router;