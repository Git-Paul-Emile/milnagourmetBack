import { logger } from '../config/logger.js';
import { prisma } from '../config/database.js';

// Client Prisma partagé : instancier un second client ouvrirait un
// pool de connexions supplémentaire, épuisant le quota PostgreSQL.

class ConfigService {
  // Récupérer toutes les configurations de statuts
  async getOrderStatusConfig() {
    try {
      return await prisma.configurationStatut.findMany({
        orderBy: { ordre: 'asc' }
      });
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la récupération des configurations de statuts:');
      // Retourner des valeurs par défaut si la table n'existe pas ou est vide
      return [
        { id: 1, statut: 'RECU', libelleFr: 'Reçue', couleurBg: 'bg-blue-100', couleurText: 'text-blue-800', icone: 'CheckCircle', ordre: 1, creeLe: new Date(), modifieLe: new Date() },
        { id: 2, statut: 'LIVREE', libelleFr: 'Livrée', couleurBg: 'bg-purple-100', couleurText: 'text-purple-800', icone: 'CheckCircle', ordre: 2, creeLe: new Date(), modifieLe: new Date() },
        { id: 3, statut: 'ANNULEE', libelleFr: 'Annulée', couleurBg: 'bg-red-100', couleurText: 'text-red-800', icone: 'XCircle', ordre: 3, creeLe: new Date(), modifieLe: new Date() }
      ];
    }
  }

  // Récupérer toutes les traductions de catégories
  async getCategoryTranslations() {
    try {
      return await prisma.traductionCategorie.findMany({
        include: {
          categorie: true
        }
      });
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la récupération des traductions de catégories:');
      // Retourner des valeurs par défaut
      return [
        { id: 1, categorieId: 1, code: 'cremeux', libelleFr: 'Crémeux', creeLe: new Date(), modifieLe: new Date(), categorie: { id: 1, nom: 'Crémeux', description: null, active: true, creeLe: new Date(), modifieLe: new Date() } },
        { id: 2, categorieId: 2, code: 'liquide', libelleFr: 'Liquide', creeLe: new Date(), modifieLe: new Date(), categorie: { id: 2, nom: 'Liquide', description: null, active: true, creeLe: new Date(), modifieLe: new Date() } },
        { id: 3, categorieId: 3, code: 'creation', libelleFr: 'Création', creeLe: new Date(), modifieLe: new Date(), categorie: { id: 3, nom: 'Création', description: null, active: true, creeLe: new Date(), modifieLe: new Date() } }
      ];
    }
  }

  // Récupérer toutes les traductions de tailles
  async getSizeTranslations() {
    try {
      return await prisma.traductionTaille.findMany({
        include: {
          taille: true
        }
      });
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la récupération des traductions de tailles:');
      // Retourner des valeurs par défaut
      return [
        { id: 1, tailleId: 1, code: 'moyen', libelleFr: 'Moyen', creeLe: new Date(), modifieLe: new Date(), taille: { id: 1, nom: 'Moyen', prix: 5000, maxFruits: 3, maxSauces: 2, cerealesAutorise: false, active: true, ordreAffichage: 1, creeLe: new Date(), modifieLe: new Date() } },
        { id: 2, tailleId: 2, code: 'maxi', libelleFr: 'Maxi', creeLe: new Date(), modifieLe: new Date(), taille: { id: 2, nom: 'Maxi', prix: 8000, maxFruits: 5, maxSauces: 3, cerealesAutorise: true, active: true, ordreAffichage: 2, creeLe: new Date(), modifieLe: new Date() } }
      ];
    }
  }

  // Récupérer toutes les configurations en une seule fois
  async getAllConfig() {
    try {
      const [statusConfig, categoryTranslations, sizeTranslations] = await Promise.all([
        this.getOrderStatusConfig(),
        this.getCategoryTranslations(),
        this.getSizeTranslations()
      ]);

      return {
        orderStatuses: statusConfig,
        categoryTranslations,
        sizeTranslations
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la récupération de toutes les configurations:');
      // Retourner des valeurs par défaut complètes
      return {
        orderStatuses: await this.getOrderStatusConfig(),
        categoryTranslations: await this.getCategoryTranslations(),
        sizeTranslations: await this.getSizeTranslations()
      };
    }
  }
}

export default new ConfigService();




