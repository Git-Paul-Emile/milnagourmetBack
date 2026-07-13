import { Router } from 'express';
import loyaltyController from '../controller/loyalty.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { usePointsSchema } from '../validator/loyalty.schema.js';
const router = Router();
// Toutes les routes de fidélité nécessitent une authentification
router.use(authenticateToken);
// Récupérer le solde de points de l'utilisateur
router.get('/points', loyaltyController.getUserPoints);
// Récupérer l'historique des points
router.get('/history', loyaltyController.getUserPointsHistory);
// Utiliser des points pour une remise
router.post('/use-points', validateResource(usePointsSchema), loyaltyController.usePoints);
// Calculer les points pour un montant (pour affichage)
router.get('/calculate', loyaltyController.calculatePoints);
export default router;
//# sourceMappingURL=loyalty.route.js.map