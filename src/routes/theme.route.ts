import { Router } from 'express';
import themeController from '../controller/theme.controller.js';
import { requireAdmin } from '../utils/admin.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { createThemeSchema, updateThemeSchema } from '../validator/theme.schema.js';

const router: Router = Router();

// Routes publiques (pour récupérer les thèmes actifs)
router.get('/active', themeController.getActiveTheme);

// Routes admin (nécessitent authentification admin)
router.use(requireAdmin);

router.get('/', themeController.getAllThemes);
router.get('/:id', themeController.getThemeById);
router.post('/', validateResource(createThemeSchema), themeController.createTheme);
router.put('/:id', validateResource(updateThemeSchema), themeController.updateTheme);
router.patch('/:id/active', themeController.setActiveTheme);
router.patch('/:id/default', themeController.setDefaultTheme);
router.delete('/:id', themeController.deleteTheme);

export default router;