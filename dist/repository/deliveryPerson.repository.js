import { prisma } from "../config/database.js";
import { logger } from '../config/logger.js';
class DeliveryPersonRepository {
    async findAll() {
        try {
            const deliveryPersons = await prisma.livreur.findMany({
                include: {
                    commandes: {
                        select: {
                            id: true,
                            statut: true,
                            montantTotal: true,
                            creeLe: true
                        }
                    }
                },
                orderBy: {
                    nomComplet: 'asc'
                }
            });
            return deliveryPersons;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des livreurs:');
            throw new Error('Impossible de récupérer les livreurs');
        }
    }
    async findById(id) {
        try {
            const deliveryPerson = await prisma.livreur.findUnique({
                where: { id: parseInt(id) },
                include: {
                    commandes: true
                }
            });
            return deliveryPerson;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération du livreur:');
            throw new Error('Impossible de récupérer le livreur');
        }
    }
    async create(data) {
        try {
            const deliveryPerson = await prisma.livreur.create({
                data: {
                    nomComplet: data.nomComplet,
                    telephone: data.telephone,
                    vehicule: data.vehicule
                }
            });
            return deliveryPerson;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création du livreur:');
            throw new Error('Impossible de créer le livreur');
        }
    }
    async update(id, data) {
        try {
            const deliveryPerson = await prisma.livreur.update({
                where: { id: parseInt(id) },
                data
            });
            return deliveryPerson;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour du livreur:');
            throw new Error('Impossible de mettre à jour le livreur');
        }
    }
    async delete(id) {
        try {
            await prisma.livreur.delete({
                where: { id: parseInt(id) }
            });
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression du livreur:');
            throw new Error('Impossible de supprimer le livreur');
        }
    }
}
export default new DeliveryPersonRepository();
//# sourceMappingURL=deliveryPerson.repository.js.map