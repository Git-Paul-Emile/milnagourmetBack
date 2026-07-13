import { Router } from 'express';
import siteController from '../controller/site.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import validateResource from '../middleware/validateResource.js';
import {
  updateBrandingSchema,
  updateAvatarToastSchema,
  updateContactSchema,
  updateSocialMediaSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  updateHeroSchema,
  updateCatalogSectionSchema,
  updateStoreHoursSchema
} from '../validator/site.schema.js';

const router: Router = Router();

// Routes pour les données du site
router.get('/branding', siteController.getBranding);
router.put('/branding', requireAdmin, validateResource(updateBrandingSchema), siteController.updateBranding);
router.get('/avatar-toast', siteController.getAvatarToast);
router.put('/avatar-toast', requireAdmin, validateResource(updateAvatarToastSchema), siteController.updateAvatarToast);
router.get('/contact', siteController.getContact);
router.put('/contact', requireAdmin, validateResource(updateContactSchema), siteController.updateContact);
router.get('/social-media', siteController.getSocialMedia);
router.put('/social-media', requireAdmin, validateResource(updateSocialMediaSchema), siteController.updateSocialMedia);
router.get('/testimonials', siteController.getTestimonials);
router.get('/testimonials/all', requireAdmin, siteController.getAllTestimonials);
router.post('/testimonials', authenticateToken, validateResource(createTestimonialSchema), siteController.createTestimonial);
router.put('/testimonials/:id', requireAdmin, validateResource(updateTestimonialSchema), siteController.updateTestimonial);
router.delete('/testimonials/:id', requireAdmin, siteController.deleteTestimonial);
router.get('/hero', siteController.getHero);
router.put('/hero', requireAdmin, validateResource(updateHeroSchema), siteController.updateHero);
router.get('/contact-section', siteController.getContactSection);
router.get('/catalog-section', siteController.getCatalogSection);
router.put('/catalog-section', requireAdmin, validateResource(updateCatalogSectionSchema), siteController.updateCatalogSection);
router.get('/navigation', siteController.getNavigation);
router.get('/store-hours', siteController.getStoreHours);
router.put('/store-hours', requireAdmin, validateResource(updateStoreHoursSchema), siteController.updateStoreHours);

export default router;
