import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import themeService from './theme.service.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class BrandingService {
    async getBranding() {
        try {
            // Récupérer le thème actif
            const activeTheme = await themeService.getActiveTheme();
            let logo;
            if (activeTheme && activeTheme.name === 'Noël') {
                logo = '/uploads/logos/noel-removebg-preview-1766180800922-611188349.png';
            }
            else {
                logo = '/uploads/logos/milna-logo.png';
            }
            // Vérifier s'il y a un logo personnalisé dans la base de données
            const branding = await prisma.marque.findFirst();
            if (branding && branding.logo && branding.logo.startsWith('/uploads/logos/')) {
                // Si c'est un logo uploadé personnalisé, l'utiliser
                logo = branding.logo;
            }
            return {
                logo
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération du branding:', error);
            throw error;
        }
    }
    async updateBranding(logo) {
        try {
            const existingBranding = await prisma.marque.findFirst();
            if (existingBranding) {
                // Update existing
                const updatedBranding = await prisma.marque.update({
                    where: { id: existingBranding.id },
                    data: { logo, modifieLe: new Date() }
                });
                return { logo: updatedBranding.logo };
            }
            else {
                // Create new
                const newBranding = await prisma.marque.create({
                    data: { logo }
                });
                return { logo: newBranding.logo };
            }
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du branding:', error);
            throw error;
        }
    }
}
export default new BrandingService();
//# sourceMappingURL=branding.service.js.map