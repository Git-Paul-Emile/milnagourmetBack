import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';



class NavigationService {
  async getNavigation() {
    try {
      const navigationItems = await prisma.navigation.findMany({
        where: { active: true },
        orderBy: { ordre: 'asc' }
      });

      return navigationItems.map((item: any) => ({
        name: item.nom,
        href: item.href
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération de la navigation:', error);
      throw error;
    }
  }
}

export default new NavigationService();