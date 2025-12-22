import { prisma } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
class HeroService {
    async getHeroData() {
        try {
            const hero = await prisma.sectionHero.findFirst({
                include: {
                    caracteristiques: {
                        orderBy: { ordre: 'asc' }
                    }
                }
            });
            if (!hero) {
                throw new AppError('Données Hero non trouvées', 404);
            }
            return {
                title: "Bienvenue à Milna Gourmet",
                subtitle: "Votre Salon du Yaourt pour des gourmets délicieusement fait maison. Découvrez notre menu dans le catalogue et savourez l'excellence à chaque cuillerée.",
                badge: "Le Salon du Yaourt Premium",
                banner: hero.banner,
                features: hero.caracteristiques.map((feature) => ({
                    title: feature.titre,
                    description: feature.description
                }))
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données Hero:', error);
            throw error;
        }
    }
    async updateHeroData(data) {
        try {
            const hero = await prisma.sectionHero.findFirst();
            if (!hero) {
                throw new AppError('Section Hero non trouvée', 404);
            }
            const updatedHero = await prisma.sectionHero.update({
                where: { id: hero.id },
                data: {
                    banner: data.banner !== undefined ? data.banner : hero.banner,
                    modifieLe: new Date()
                },
                include: {
                    caracteristiques: {
                        orderBy: { ordre: 'asc' }
                    }
                }
            });
            return {
                title: "Bienvenue à Milna Gourmet",
                subtitle: "Votre Salon du Yaourt pour des gourmets délicieusement fait maison. Découvrez notre menu dans le catalogue et savourez l'excellence à chaque cuillerée.",
                badge: "Le Salon du Yaourt Premium",
                banner: updatedHero.banner,
                features: updatedHero.caracteristiques.map((feature) => ({
                    title: feature.titre,
                    description: feature.description
                }))
            };
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour des données Hero:', error);
            throw error;
        }
    }
}
export default new HeroService();
//# sourceMappingURL=hero.service.js.map