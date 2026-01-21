import userRepository from '../repository/user.repository.js';
import type { Utilisateur } from '@prisma/client';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validator/auth.schema.js';
import { registerSchema, loginSchema } from '../validator/auth.schema.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type AccessTokenPayload, type RefreshTokenPayload } from '../config/jwt.js';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

class AuthService {
  private userRepository = userRepository;

  async register(data: any): Promise<{ user: Utilisateur; accessToken: string; refreshToken: string }> {
    try {
      // Validation des données
      const validatedData = registerSchema.parse(data);

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

      console.log(`Utilisateur créé avec succès: ${user.nomComplet} (${user.telephone})`);

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Erreur dans le service lors de l\'inscription:', error);
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
        throw new Error('Aucun compte trouvé avec ce numéro de téléphone');
      }

      // Vérifier le mot de passe hashé
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Fusionner le panier guest si fourni
      if (validatedData.guestCart && validatedData.guestCart.length > 0) {
        const cartService = (await import('./cart.service.js')).default;
        await cartService.mergeGuestCart(user.id, validatedData.guestCart);
        console.log(`Panier guest fusionné pour l'utilisateur: ${user.nomComplet}`);
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

      console.log(`Connexion réussie pour: ${user.nomComplet} (${user.telephone})`);

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Erreur dans le service lors de la connexion:', error);
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
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier la version du token
      if (user.tokenVersion !== decoded.tokenVersion) {
        throw new Error('Token de rafraîchissement invalide');
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
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  async logoutAll(userId: string): Promise<void> {
    try {
      await userRepository.incrementTokenVersion(userId);
      console.log(`Déconnexion de tous les appareils pour l'utilisateur: ${userId}`);
    } catch (error) {
      console.error('Erreur lors de la déconnexion globale:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Utilisateur | null> {
    try {
      const user = await userRepository.findById(id);
      return user;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  async updateProfile(id: string, updateData: UpdateProfileInput): Promise<Utilisateur> {
    try {
      // Préparer les données de mise à jour
      const updatePayload: any = {};

      if (updateData.nom) updatePayload.nomComplet = updateData.nom;
      if (updateData.telephone) updatePayload.telephone = updateData.telephone;
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
          throw new Error('Utilisateur non trouvé');
        }

        // Utiliser le champ password du modèle Prisma
        const isOldPasswordValid = await bcrypt.compare(updateData.ancienMotDePasse, user.password);
        if (!isOldPasswordValid) {
          throw new Error('L\'ancien mot de passe est incorrect');
        }
      }

      const updatedUser = await userRepository.update(id, updatePayload);

      console.log(`Profil mis à jour pour: ${updatedUser.nomComplet} (${updatedUser.telephone})`);

      return updatedUser;
    } catch (error) {
      console.error('Erreur dans le service lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      await userRepository.delete(userId);
      console.log(`Compte supprimé pour l'utilisateur: ${userId}`);
    } catch (error) {
      console.error('Erreur dans le service lors de la suppression du compte:', error);
      throw error;
    }
  }
}

export default new AuthService();