import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';

interface ThemeColors {
  [key: string]: string;
}

interface CreateThemeData {
  name: string;
  description?: string;
  lightColors: ThemeColors;
  darkColors?: ThemeColors;
}

interface UpdateThemeData {
  name?: string;
  description?: string;
  lightColors?: ThemeColors;
  darkColors?: ThemeColors;
}

class ThemeService {
  async getAllThemes() {
    try {
      return await prisma.theme.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes:', error);
      throw error;
    }
  }

  async getActiveTheme() {
    try {
      const activeTheme = await prisma.theme.findFirst({
        where: { isActive: true }
      });

      if (!activeTheme) {
        // Retourner le thème par défaut si aucun actif
        return await prisma.theme.findFirst({
          where: { isDefault: true }
        });
      }

      return activeTheme;
    } catch (error) {
      console.error('Erreur lors de la récupération du thème actif:', error);
      throw error;
    }
  }

  async getThemeById(id: number) {
    try {
      const theme = await prisma.theme.findUnique({
        where: { id }
      });

      if (!theme) {
        throw new AppError('Thème non trouvé', 404);
      }

      return theme;
    } catch (error) {
      console.error('Erreur lors de la récupération du thème:', error);
      throw error;
    }
  }

  async createTheme(data: CreateThemeData) {
    try {
      // Vérifier que le nom est unique
      const existingTheme = await prisma.theme.findUnique({
        where: { name: data.name }
      });

      if (existingTheme) {
        throw new AppError('Un thème avec ce nom existe déjà', 400);
      }

      return await prisma.theme.create({
        data: {
          name: data.name,
          description: data.description,
          lightColors: data.lightColors,
          darkColors: data.darkColors
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du thème:', error);
      throw error;
    }
  }

  async updateTheme(id: number, data: UpdateThemeData) {
    try {
      const theme = await this.getThemeById(id);

      // Vérifier l'unicité du nom si modifié
      if (data.name && data.name !== theme.name) {
        const existingTheme = await prisma.theme.findUnique({
          where: { name: data.name }
        });

        if (existingTheme) {
          throw new AppError('Un thème avec ce nom existe déjà', 400);
        }
      }

      return await prisma.theme.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          lightColors: data.lightColors,
          darkColors: data.darkColors,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du thème:', error);
      throw error;
    }
  }

  async setActiveTheme(id: number) {
    try {
      const theme = await this.getThemeById(id);

      // Désactiver tous les thèmes
      await prisma.theme.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      // Activer le thème sélectionné
      return await prisma.theme.update({
        where: { id },
        data: { isActive: true, updatedAt: new Date() }
      });
    } catch (error) {
      console.error('Erreur lors de l\'activation du thème:', error);
      throw error;
    }
  }

  async setDefaultTheme(id: number) {
    try {
      const theme = await this.getThemeById(id);

      // Désactiver tous les thèmes par défaut
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });

      // Définir comme défaut
      return await prisma.theme.update({
        where: { id },
        data: { isDefault: true, updatedAt: new Date() }
      });
    } catch (error) {
      console.error('Erreur lors de la définition du thème par défaut:', error);
      throw error;
    }
  }

  async deleteTheme(id: number) {
    try {
      const theme = await this.getThemeById(id);

      // Ne pas supprimer le thème par défaut
      if (theme.isDefault) {
        throw new AppError('Impossible de supprimer le thème par défaut', 400);
      }

      // Si c'est le thème actif, activer le thème par défaut
      if (theme.isActive) {
        const defaultTheme = await prisma.theme.findFirst({
          where: { isDefault: true }
        });

        if (defaultTheme) {
          await this.setActiveTheme(defaultTheme.id);
        }
      }

      await prisma.theme.delete({
        where: { id }
      });

      return { message: 'Thème supprimé avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression du thème:', error);
      throw error;
    }
  }
}

export default new ThemeService();