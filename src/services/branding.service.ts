import { prisma } from '../config/database.js';
import cloudinary from '../config/cloudinary.js';

const DEFAULT_LOGO = cloudinary.url('milnagourmet/logos/milna-logo.png', { secure: true });

class BrandingService {
  async getBranding() {
    try {
      let logo: string = DEFAULT_LOGO;

      // Vérifier s'il y a un logo personnalisé dans la base de données
      const branding = await prisma.marque.findFirst();
      if (branding && branding.logo && branding.logo !== DEFAULT_LOGO) {
        // Si c'est un logo personnalisé (différent du logo classique par défaut), l'utiliser
        logo = branding.logo;
      }

      return {
        logo
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du branding:', error);
      throw error;
    }
  }

  async updateBranding(logo: string) {
    try {
      const existingBranding = await prisma.marque.findFirst();

      if (existingBranding) {
        // Update existing
        const updatedBranding = await prisma.marque.update({
          where: { id: existingBranding.id },
          data: { logo, modifieLe: new Date() }
        });
        return { logo: updatedBranding.logo };
      } else {
        // Create new
        const newBranding = await prisma.marque.create({
          data: { logo }
        });
        return { logo: newBranding.logo };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du branding:', error);
      throw error;
    }
  }
}

export default new BrandingService();