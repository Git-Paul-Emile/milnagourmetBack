import { prisma } from "../config/database.js";
import { logger } from '../config/logger.js';
class FruitRepository {
    async create(data) {
        try {
            const fruit = await prisma.fruit.create({ data });
            return fruit;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création du fruit:');
            throw new Error('Impossible de créer le fruit');
        }
    }
    async findAll() {
        try {
            const fruits = await prisma.fruit.findMany({
                where: { disponible: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return fruits;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des fruits:');
            throw new Error('Impossible de récupérer les fruits');
        }
    }
    async findById(id) {
        try {
            const fruit = await prisma.fruit.findUnique({
                where: { id }
            });
            return fruit;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération du fruit:');
            throw new Error('Impossible de récupérer le fruit');
        }
    }
    async update(id, data) {
        try {
            const fruit = await prisma.fruit.update({
                where: { id },
                data
            });
            return fruit;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour du fruit:');
            throw new Error('Impossible de mettre à jour le fruit');
        }
    }
    async delete(id) {
        try {
            const fruit = await prisma.fruit.delete({
                where: { id }
            });
            return fruit;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression du fruit:');
            throw new Error('Impossible de supprimer le fruit');
        }
    }
}
export default new FruitRepository();
//# sourceMappingURL=fruit.repository.js.map