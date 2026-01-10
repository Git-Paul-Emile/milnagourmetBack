import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import deliveryZoneService from '../services/deliveryZone.service.js';
import { jsonResponse, AppError } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { verifyRefreshToken } from '../config/jwt.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookie.utils.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validator/auth.schema.js';
import { updateProfileSchema } from '../validator/auth.schema.js';
import type { Utilisateur } from '@prisma/client';

// Helper function to adapt user data for frontend with zone name
async function adaptUserForFrontend(user: Utilisateur) {
  let zoneLivraison = null;
  if (user.zoneLivraisonId) {
    try {
      const zone = await deliveryZoneService.getDeliveryZoneById(user.zoneLivraisonId);
      zoneLivraison = zone.name;
    } catch (error) {
      console.warn(`Could not fetch delivery zone for user ${user.id}:`, error);
      zoneLivraison = null;
    }
  }

  return {
    id: user.id,
    nomComplet: user.nomComplet,
    telephone: user.telephone,
    zoneLivraisonId: user.zoneLivraisonId?.toString() || null,
    zoneLivraison,
    role: user.role || 'USER',
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

class AuthController {
  private authService = authService;

  // Inscription d'un nouvel utilisateur
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterInput = req.body;
      const { user, accessToken, refreshToken } = await authService.register(userData);

      // Adapter les données pour le frontend
      const adaptedUser = await adaptUserForFrontend(user);

      // Définir le refresh token dans un cookie httpOnly
      setAuthCookie(res, refreshToken);

      res.status(StatusCodes.CREATED).json(
        jsonResponse({
          status: 'success',
          message: `Bienvenue ${user.nomComplet} ! Votre compte a été créé avec succès.`,
          data: {
            user: adaptedUser,
            accessToken
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Connexion d'un utilisateur
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginInput = req.body;
      const { user, accessToken, refreshToken } = await authService.login(loginData);

      // Adapter les données pour le frontend
      const adaptedUser = await adaptUserForFrontend(user);

      // Définir le refresh token dans un cookie httpOnly
      setAuthCookie(res, refreshToken);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: `Bon retour ${user.nomComplet} !`,
          data: {
            user: adaptedUser,
            accessToken
          }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Rafraîchir le token d'accès
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('[PROD DEBUG] Refresh attempt, refreshToken present:', !!req.cookies.refreshToken);
      const { refreshToken } = req.cookies;

      // Débogage: afficher si cookie de refresh présent et certaines métadonnées (masquer le token complet)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AuthController.refresh] Requête de rafraîchissement reçue');
        console.log('[AuthController.refresh] Cookies:', req.cookies);
        console.log('[AuthController.refresh] refreshToken présent:', !!refreshToken);
        if (refreshToken) {
          const masked = String(refreshToken).length > 12 ? `${String(refreshToken).slice(0,6)}...${String(refreshToken).slice(-6)}` : String(refreshToken);
          console.log('[AuthController.refresh] refreshToken (masqué):', masked);
        }
        console.log('[AuthController.refresh] Origin:', req.headers.origin || 'n/a', 'IP:', req.ip || 'n/a');
      }

      if (!refreshToken) {
        throw new AppError('Refresh token manquant', StatusCodes.UNAUTHORIZED);
      }

      const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

      // Mettre à jour le refresh token dans le cookie
      setAuthCookie(res, newRefreshToken);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Token rafraîchi avec succès',
          data: { accessToken }
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Déconnexion
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Supprimer le refresh token du cookie
      clearAuthCookie(res);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Déconnexion réussie'
        })
      );
    } catch (error) {
      console.log('[PROD DEBUG] Refresh error:', (error as Error).message);
      next(error);
    }
  }

  // Déconnexion de tous les appareils
  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      await authService.logoutAll(userId);

      // Supprimer le refresh token du cookie
      clearAuthCookie(res);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Déconnexion de tous les appareils réussie'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Récupérer le profil de l'utilisateur connecté (/me)
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      const user = await authService.findById(userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', StatusCodes.NOT_FOUND);
      }

      // Adapter les données pour le frontend
      const adaptedUser = await adaptUserForFrontend(user);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Profil récupéré avec succès',
          data: adaptedUser
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour le profil de l'utilisateur connecté
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      const updateData = req.body as UpdateProfileInput;
      // Appeler la méthode de service pour mettre à jour le profil
      const user = await authService.updateProfile(userId, updateData);

      if (!user) {
        throw new AppError('Utilisateur non trouvé', StatusCodes.NOT_FOUND);
      }

      // Adapter les données pour le frontend
      const adaptedUser = await adaptUserForFrontend(user);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Profil mis à jour avec succès',
          data: adaptedUser
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Supprimer le compte de l'utilisateur connecté
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Utilisateur non authentifié', StatusCodes.UNAUTHORIZED);
      }

      await authService.deleteAccount(userId);

      res.status(StatusCodes.OK).json(
        jsonResponse({
          status: 'success',
          message: 'Compte supprimé avec succès'
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
