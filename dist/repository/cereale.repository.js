import { prisma } from "../config/database.js";
import { logger } from '../config/logger.js';
class CerealeRepository {
    async create(data) {
        try {
            const cereale = await prisma.cereale.create({ data });
            return cereale;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création de la céréale:');
            throw new Error('Impossible de créer la céréale');
        }
    }
    async findAll() {
        try {
            const cereales = await prisma.cereale.findMany({
                where: { disponible: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return cereales;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des céréales:');
            throw new Error('Impossible de récupérer les céréales');
        }
    }
    async findById(id) {
        try {
            const cereale = await prisma.cereale.findUnique({
                where: { id }
            });
            return cereale;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération de la céréale:');
            throw new Error('Impossible de récupérer la céréale');
        }
    }
    async update(id, data) {
        try {
            const cereale = await prisma.cereale.update({
                where: { id },
                data
            });
            return cereale;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour de la céréale:');
            throw new Error('Impossible de mettre à jour la céréale');
        }
    }
    async delete(id) {
        try {
            const cereale = await prisma.cereale.delete({
                where: { id }
            });
            return cereale;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression de la céréale:');
            throw new Error('Impossible de supprimer la céréale');
        }
    }
}
export default new CerealeRepository();
//# sourceMappingURL=cereale.repository.js.map