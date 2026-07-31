import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

class AvatarToastService {
  async getAvatarToast() {
    try {
      const avatarToast = await prisma.avatarToast.findFirst();
      if (!avatarToast) {
        throw new AppError('Avatar pour les toasts non trouvé', 404);
      }
      return {
        image: avatarToast.image
      };
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la récupération de l\'avatar toast:');
      throw error;
    }
  }

  async updateAvatarToast(image: string) {
    try {
      const existingAvatarToast = await prisma.avatarToast.findFirst();

      if (existingAvatarToast) {
        // Update existing
        const updatedAvatarToast = await prisma.avatarToast.update({
          where: { id: existingAvatarToast.id },
          data: { image, modifieLe: new Date() }
        });
        return { image: updatedAvatarToast.image };
      } else {
        // Create new
        const newAvatarToast = await prisma.avatarToast.create({
          data: { image }
        });
        return { image: newAvatarToast.image };
      }
    } catch (error) {
      logger.error({ err: error }, 'Erreur lors de la mise à jour de l\'avatar toast:');
      throw error;
    }
  }
}

export default new AvatarToastService();