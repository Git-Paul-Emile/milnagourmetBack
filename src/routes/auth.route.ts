import { Router } from 'express';
import authController from '../controller/auth.controller.js';
import { authenticateToken } from '../utils/auth.middleware.js';

const router = Router();

// Inscription d'un nouvel utilisateur
router.post('/register', authController.register);

// Connexion d'un utilisateur
router.post('/login', authController.login);

// Rafraîchir le token d'accès
router.post('/refresh', authController.refresh);

// Déconnexion
router.post('/logout', authController.logout);

// Déconnexion de tous les appareils
router.post('/logout-all', authenticateToken, authController.logoutAll);

// Récupérer le profil de l'utilisateur connecté (/me)
router.get('/me', authenticateToken, authController.getProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/profile', authenticateToken, authController.updateProfile);

// Supprimer le compte de l'utilisateur connecté
router.delete('/account', authenticateToken, authController.deleteAccount);

export default router;