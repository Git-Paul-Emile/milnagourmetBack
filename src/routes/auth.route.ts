import { Router } from 'express';
import authController from '../controller/auth.controller.js';
import passwordResetController from '../controller/passwordReset.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';
import validateResource from '../middleware/validateResource.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validator/auth.schema.js';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validator/passwordReset.schema.js';
import {
  authLimiter,
  refreshLimiter,
  passwordResetLimiter,
} from '../middleware/rateLimiter.js';

const router: Router = Router();

// Inscription d'un nouvel utilisateur
router.post('/register', authLimiter, validateResource(registerSchema), authController.register);

// Connexion d'un utilisateur
router.post('/login', authLimiter, validateResource(loginSchema), authController.login);

// Rafraîchir le token d'accès
router.post('/refresh', refreshLimiter, authController.refresh);

// Déconnexion
router.post('/logout', authController.logout);

// Déconnexion de tous les appareils
router.post('/logout-all', authenticateToken, authController.logoutAll);

// --- Réinitialisation de mot de passe -------------------------------
// Étape 1 : demander un lien par email. La réponse est toujours identique,
// que le compte existe ou non (protection contre l'énumération de comptes).
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validateResource(forgotPasswordSchema),
  passwordResetController.forgotPassword
);

// Étape 2 : appliquer le nouveau mot de passe à partir du jeton reçu par
// email. Le limiteur d'authentification protège contre le tirage de
// jetons au hasard.
router.post(
  '/reset-password',
  authLimiter,
  validateResource(resetPasswordSchema),
  passwordResetController.resetPassword
);

// Récupérer le profil de l'utilisateur connecté (/me)
router.get('/me', authenticateToken, authController.getProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', authenticateToken, validateResource(updateProfileSchema), authController.updateProfile);

// Supprimer le compte de l'utilisateur connecté
router.delete('/account', authenticateToken, authController.deleteAccount);

export default router;
