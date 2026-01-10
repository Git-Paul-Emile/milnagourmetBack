import { Router } from 'express';
import authController from '../controller/auth.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validator/auth.schema.js';
const router = Router();
// Inscription d'un nouvel utilisateur
router.post('/register', validateResource(registerSchema), authController.register);
// Connexion d'un utilisateur
router.post('/login', validateResource(loginSchema), authController.login);
// Rafraîchir le token d'accès
router.post('/refresh', authController.refresh);
// Déconnexion
router.post('/logout', authController.logout);
// Déconnexion de tous les appareils
router.post('/logout-all', authenticateToken, authController.logoutAll);
// Récupérer le profil de l'utilisateur connecté (/me)
router.get('/me', authenticateToken, authController.getProfile);
// Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', authenticateToken, validateResource(updateProfileSchema), authController.updateProfile);
// Supprimer le compte de l'utilisateur connecté
router.delete('/account', authenticateToken, authController.deleteAccount);
export default router;
//# sourceMappingURL=auth.route.js.map