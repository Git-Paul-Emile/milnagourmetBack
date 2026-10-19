import { Router } from 'express';
import pwaController from '../controller/pwa.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { pwaEventLimiter } from '../middleware/rateLimiter.js';
import { createPwaEventSchema } from '../validator/pwa.schema.js';

const router: Router = Router();

router.post('/events', pwaEventLimiter, validateResource(createPwaEventSchema), pwaController.createEvent);
router.get('/stats', requireAdmin, pwaController.getStats);

export default router;
