import { Router } from 'express';
import multer from 'multer';
import productController from '../controller/product.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
const router = Router();
// Configuration de multer pour parser le FormData (sans sauvegarde de fichier pour la mise à jour)
const upload = multer();
// Créer un produit (ADMIN)
router.post('/', requireAdmin, productController.create);
// Récupérer tous les produits
router.get('/', productController.findAll);
// Récupérer un produit par ID
router.get('/:id', productController.findById);
// Mettre à jour un produit (ADMIN) - avec support FormData
router.put('/:id', requireAdmin, upload.any(), productController.update);
// Supprimer un produit (ADMIN)
router.delete('/:id', requireAdmin, productController.delete);
export default router;
//# sourceMappingURL=product.route.js.map