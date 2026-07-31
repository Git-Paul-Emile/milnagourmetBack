import userRepository from '../repository/user.repository.js';
import type { Utilisateur } from '@prisma/client';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validator/auth.schema.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type AccessTokenPayload, type RefreshTokenPayload } from '../config/jwt.js';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

class AuthService {
  private userRepository = userRepository;

  /**
   * Inscription d'un nouvel utilisateur.
   *
   * ATTENTION — VALIDATION UNIQUE
   * Les données arrivent DÉJÀ validées et transformées par le middleware
   * `validateResource(registerSchema)` monté sur la route. Il ne faut
   * surtout pas revalider ici : `zoneLivraisonId` a été converti de
   * `string` en `number` par le schéma, et une seconde passe échouerait
   * systématiquement avec « expected string, received number » — c'est
   * exactement le bug que ce commentaire prévient.
   *
   * Règle générale : un schéma qui transforme ses données ne peut pas
   * être appliqué deux fois. La validation appartient à la frontière
   * HTTP, pas au service.
   */
  async register(data: RegisterInput): Promise<{ user: Utilisateur; accessToken: string; refreshToken: string }> {
    try {
      const validatedData = data;

      // Vérifier si un utilisateur avec ce téléphone existe déjà
      const existingUser = await userRepository.findByPhone(validatedData.telephone);
      if (existingUser) {
        throw new AppError('Un compte avec ce numéro de téléphone existe déjà', StatusCodes.BAD_REQUEST);
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const user = await userRepository.create({
        ...validatedData,
        password: hashedPassword
      });

      // Fusionner le panier guest si fourni (ne doit jamais faire échouer l'inscription elle-même)
      if (validatedData.guestCart && validatedData.guestCart.length > 0) {
        try {
          const cartService = (await import('./cart.service.js')).default;
          await cartService.mergeGuestCart(user.id, validatedData.guestCart);
          logger.info(`Panier guest fusionné pour le nouvel utilisateur: ${user.nomComplet}`);
        } catch (mergeError) {
          logger.error({ err: mergeError }, 'Erreur lors de la fusion du panier guest à l\'inscription (ignorée) :');
        }
      }

      // Générer les tokens après création de l'utilisateur
      const accessToken = generateAccessToken({
        userId: user.id.toString(),
        telephone: user.telephone,
        nomComplet: user.nomComplet,
        zoneLivraisonId: user.zoneLivraisonId?.toString() || null,
        role: user.role || 'USER'
      });

      const refreshToken = generateRefreshToken({
        userId: user.id.toString(),
        tokenVersion: user.tokenVersion
      });

      logger.info(`Utilisateur créé avec succès: ${user.nomComplet} (${user.telephone})`);

      return { user, accessToken, refreshToken };
    } catch (error) {
      logger.error({ err: error }, "Erreur dans le service lors de l'inscription");
      // Filet : si un appelant interne transmettait un jour des données
      // non validées, on renvoie un 400 explicite plutôt qu'un 500.
      if (error instanceof ZodError) {
        throw new AppError(error.issues.map((issue) => issue.message).join(', '), StatusCodes.BAD_REQUEST);
      }
      throw error;
    }
  }

  async login(data: LoginInput): Promise<{ user: Utilisateur; accessToken: string; refreshToken: string }> {
    try {
      // Validation des données gérée par le middleware
      const validatedData = data;

      // Trouver l'utilisateur par téléphone
      const user = await userRepository.findByPhone(validatedData.telephone);
      if (!user) {
        throw new AppError('Aucun compte trouvé avec ce numéro de téléphone', StatusCodes.UNAUTHORIZED);
      }

      if (user.blocked) {
        throw new AppError('Ce compte a été bloqué', StatusCodes.FORBIDDEN);
      }

      // Vérifier le mot de passe hashé
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Mot de passe incorrect', StatusCodes.UNAUTHORIZED);
      }

      // Fusionner le panier guest si fourni (ne doit jamais faire échouer la connexion elle-même)
      if (validatedData.guestCart && validatedData.guestCart.length > 0) {
        try {
          const cartService = (await import('./cart.service.js')).default;
          await cartService.mergeGuestCart(user.id, validatedData.guestCart);
          logger.info(`Panier guest fusionné pour l'utilisateur: ${user.nomComplet}`);
        } catch (mergeError) {
          logger.error({ err: mergeError }, 'Erreur lors de la fusion du panier guest à la connexion (ignorée) :');
        }
      }

      // Générer les tokens
      const accessToken = generateAccessToken({
        userId: user.id.toString(),
        telephone: user.telephone,
        nomComplet: user.nomComplet,
        zoneLivraisonId: user.zoneLivraisonId?.toString() || null,
        role: user.role || 'USER'
      });

      const refreshToken = generateRefreshToken({
        userId: user.id.toString(),
        tokenVersion: user.tokenVersion
      });

      logger.info(`Connexion réussie pour: ${user.nomComplet} (${user.telephone})`);

      return { user, accessToken, refreshToken };
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la connexion:');
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Vérifier le refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Récupérer l'utilisateur
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError('Utilisateur non trouvé', StatusCodes.UNAUTHORIZED);
      }

      // Vérifier la version du token
      if (user.tokenVersion !== decoded.tokenVersion) {
        throw new AppError('Token de rafraîchissement invalide', StatusCodes.UNAUTHORIZED);
      }

      // Incrémenter la version du token pour rotation et récupérer la nouvelle valeur
      const updatedUser = await userRepository.incrementTokenVersion(user.id.toString());

      // Générer de nouveaux tokens en utilisant l'utilisateur mis à jour (nouveau tokenVersion)
      const newAccessToken = generateAccessToken({
        userId: updatedUser.id.toString(),
        telephone: updatedUser.telephone,
        nomComplet: updatedUser.nomComplet,
        zoneLivraisonId: updatedUser.zoneLivraisonId?.toString() || null,
        role: updatedUser.role || 'USER'
      });

      const newRefreshToken = generateRefreshToken({
        userId: updatedUser.id.toString(),
        tokenVersion: updatedUser.tokenVersion
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors du rafraîchissement du token:');
      // Un refresh token expiré/invalide (erreur jwt brute) doit se traduire par 401, pas 500
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Session expirée, veuillez vous reconnecter', StatusCodes.UNAUTHORIZED);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      await userRepository.incrementTokenVersion(userId);
      logger.info(`Déconnexion de tous les appareils pour l'utilisateur: ${userId}`);
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la déconnexion globale:');
      throw error;
    }
  }

  async findById(id: string): Promise<Utilisateur | null> {
    try {
      const user = await userRepository.findById(id);
      return user;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la récupération de l\'utilisateur:');
      throw error;
    }
  }

  async updateProfile(id: string, updateData: UpdateProfileInput): Promise<Utilisateur> {
    try {
      // Préparer les données de mise à jour
      const updatePayload: Partial<Utilisateur> = {};

      if (updateData.nom) updatePayload.nomComplet = updateData.nom;
      if (updateData.telephone) updatePayload.telephone = updateData.telephone;
      // `!== undefined` et non `if (updateData.email)` : il faut pouvoir
      // effacer une adresse en envoyant une chaîne vide, que le schéma
      // transforme en `undefined`… donc seule une valeur explicitement
      // fournie met le champ à jour.
      if (updateData.email !== undefined) updatePayload.email = updateData.email;
      if (updateData.deliveryZoneId) {
        // Le frontend envoie deliveryZoneId (id de la zone)
        updatePayload.zoneLivraisonId = updateData.deliveryZoneId;
      }

      // Si un nouveau mot de passe est fourni, le hasher
      if (updateData.motDePasse) {
        const hashedPassword = await bcrypt.hash(updateData.motDePasse, 10);
        updatePayload.password = hashedPassword;
      }

      // Vérifier l'ancien mot de passe si un nouveau mot de passe est fourni
      if (updateData.motDePasse && updateData.ancienMotDePasse) {
        const user = await userRepository.findById(id);
        if (!user) {
          throw new AppError('Utilisateur non trouvé', StatusCodes.NOT_FOUND);
        }

        // Utiliser le champ password du modèle Prisma
        const isOldPasswordValid = await bcrypt.compare(updateData.ancienMotDePasse, user.password);
        if (!isOldPasswordValid) {
          throw new AppError('L\'ancien mot de passe est incorrect', StatusCodes.UNAUTHORIZED);
        }
      }

      const updatedUser = await userRepository.update(id, updatePayload);

      logger.info(`Profil mis à jour pour: ${updatedUser.nomComplet} (${updatedUser.telephone})`);

      return updatedUser;
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la mise à jour du profil:');
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      await userRepository.delete(userId);
      logger.info(`Compte supprimé pour l'utilisateur: ${userId}`);
    } catch (error) {
      logger.error({ err: error }, 'Erreur dans le service lors de la suppression du compte:');
      throw error;
    }
  }
}

export default new AuthService();