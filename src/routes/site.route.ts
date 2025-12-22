import { Router } from 'express';
import siteController from '../controller/site.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';

const router = Router();

// Routes pour les données du site
router.get('/branding', siteController.getBranding);
router.put('/branding', siteController.updateBranding);
router.get('/avatar-toast', siteController.getAvatarToast);
router.put('/avatar-toast', siteController.updateAvatarToast);
router.get('/contact', siteController.getContact);
router.put('/contact', siteController.updateContact);
router.get('/social-media', siteController.getSocialMedia);
router.put('/social-media', siteController.updateSocialMedia);
router.get('/testimonials', siteController.getTestimonials);
router.get('/testimonials/all', siteController.getAllTestimonials);
router.post('/testimonials', authenticateToken, siteController.createTestimonial);
router.put('/testimonials/:id', siteController.updateTestimonial);
router.delete('/testimonials/:id', siteController.deleteTestimonial);
router.get('/hero', siteController.getHero);
router.put('/hero', siteController.updateHero);
router.get('/contact-section', siteController.getContactSection);
router.get('/catalog-section', siteController.getCatalogSection);
router.put('/catalog-section', siteController.updateCatalogSection);
router.get('/navigation', siteController.getNavigation);
router.get('/store-hours', siteController.getStoreHours);
router.put('/store-hours', siteController.updateStoreHours);

export default router;