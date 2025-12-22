import { Router } from 'express';
import configController from '../controller/config.controller.js';

const router: Router = Router();

// Récupérer toutes les configurations
router.get('/', configController.getAllConfig);

// Récupérer les configurations de statuts
router.get('/order-statuses', configController.getOrderStatusConfig);

// Récupérer les traductions de catégories
router.get('/category-translations', configController.getCategoryTranslations);

// Récupérer les traductions de tailles
router.get('/size-translations', configController.getSizeTranslations);

export default router;




