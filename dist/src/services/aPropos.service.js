import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError.js';
const prisma = new PrismaClient();
class AProposService {
    async getAboutData() {
        try {
            const about = await prisma.aPropos.findFirst({
                include: {
                    valeurs: {
                        orderBy: { ordre: 'asc' }
                    },
                    missions: {
                        orderBy: { ordre: 'asc' }
                    },
                    statistiques: true
                }
            });
            if (!about) {
                throw new AppError('Données About non trouvées', 404);
            }
            // Transformer les statistiques en objet
            const stats = {};
            about.statistiques.forEach(stat => {
                stats[stat.cle] = stat.valeur;
            });
            return {
                title: about.titre,
                description: about.description,
                values: about.valeurs.map(valeur => ({
                    title: valeur.titre,
                    description: valeur.description,
                    icon: valeur.icone
                })),
                missions: about.missions.map(mission => ({
                    title: mission.titre,
                    description: mission.texte,
                    icon: mission.icone || 'heart' // Utilise l'icône de la DB ou valeur par défaut
                })),
                stats: {
                    satisfiedCustomers: stats.clientsSatisfaits || 0,
                    uniqueFlavors: stats.yaourtsVendus || 0,
                    yearsExperience: stats.anneesExperience || 0
                }
            };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données About:', error);
            throw error;
        }
    }
}
export default new AProposService();
//# sourceMappingURL=aPropos.service.js.map