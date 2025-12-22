import { Router } from 'express';
import categorieController from '../controller/categorie.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
const router = Router();
// Créer une catégorie (ADMIN)
router.post('/', requireAdmin, categorieController.create);
// Récupérer toutes les catégories
router.get('/', categorieController.findAll);
// Récupérer une catégorie par ID
router.get('/:id', categorieController.findById);
// Mettre à jour une catégorie (ADMIN)
router.put('/:id', requireAdmin, categorieController.update);
// Supprimer une catégorie (ADMIN)
router.delete('/:id', requireAdmin, categorieController.delete);
export default router;
//# sourceMappingURL=categorie.route.js.map