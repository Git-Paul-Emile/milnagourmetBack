import { Router } from 'express';
import uploadController from '../controller/upload.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import { authenticateToken } from '../utils/auth.middleware.js';
const router = Router();
// Upload d'une image de produit (ADMIN)
router.post('/product-image', requireAdmin, uploadController.uploadProductImage);
// Upload d'une image de logo (ADMIN)
router.post('/logo-image', requireAdmin, uploadController.uploadLogoImage);
// Upload d'une image de bannière (ADMIN)
router.post('/banner-image', requireAdmin, uploadController.uploadBannerImage);
// Upload d'une image de témoignage (AUTHENTIFIED USER)
router.post('/testimonial-image', authenticateToken, uploadController.uploadTestimonialImage);
// Upload d'une image de catégorie (ADMIN)
router.post('/category-image', requireAdmin, uploadController.uploadCategoryImage);
// Upload d'une image de fruit (ADMIN)
router.post('/fruit-image', requireAdmin, uploadController.uploadFruitImage);
// Upload d'une image de sauce (ADMIN)
router.post('/sauce-image', requireAdmin, uploadController.uploadSauceImage);
// Upload d'une image de céréale (ADMIN)
router.post('/cereale-image', requireAdmin, uploadController.uploadCerealeImage);
// Upload d'une image d'avatar pour les toasts (ADMIN)
router.post('/avatar-toast-image', requireAdmin, uploadController.uploadAvatarToastImage);
// Lister les images disponibles (ADMIN)
router.get('/images', requireAdmin, uploadController.listImages);
// Récupérer les images utilisées (ADMIN)
router.get('/used-images', authenticateToken, uploadController.getUsedImages);
// Supprimer une image (ADMIN)
router.delete('/images/:folder/:filename', requireAdmin, uploadController.deleteImage);
export default router;
//# sourceMappingURL=upload.route.js.map