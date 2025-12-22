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
// Lister les images disponibles (ADMIN)
router.get('/images', requireAdmin, uploadController.listImages);
// Récupérer les images utilisées (ADMIN)
router.get('/used-images', authenticateToken, uploadController.getUsedImages);
// Supprimer une image (ADMIN)
router.delete('/images/:folder/:filename', requireAdmin, uploadController.deleteImage);
export default router;
//# sourceMappingURL=upload.route.js.map