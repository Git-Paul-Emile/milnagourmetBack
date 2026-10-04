import { prisma } from "../config/database.js";
import { logger } from '../config/logger.js';
class TemoinageRepository {
    async findAllActive() {
        try {
            const testimonials = await prisma.temoinage.findMany({
                where: { active: true },
                orderBy: { date: 'desc' },
                take: 5
            });
            return testimonials;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération des témoignages:');
            throw new Error('Impossible de récupérer les témoignages');
        }
    }
    async findAll() {
        try {
            const testimonials = await prisma.temoinage.findMany({
                orderBy: { date: 'desc' }
            });
            return testimonials;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la récupération de tous les témoignages:');
            throw new Error('Impossible de récupérer tous les témoignages');
        }
    }
    async create(data) {
        try {
            const testimonial = await prisma.temoinage.create({
                data
            });
            return testimonial;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la création du témoignage:');
            throw new Error('Impossible de créer le témoignage');
        }
    }
    async update(id, data) {
        try {
            const testimonial = await prisma.temoinage.update({
                where: { id },
                data
            });
            return testimonial;
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la mise à jour du témoignage:');
            throw new Error('Impossible de mettre à jour le témoignage');
        }
    }
    async delete(id) {
        try {
            await prisma.temoinage.delete({
                where: { id }
            });
        }
        catch (error) {
            logger.error({ err: error }, 'Erreur lors de la suppression du témoignage:');
            throw new Error('Impossible de supprimer le témoignage');
        }
    }
}
export default new TemoinageRepository();
//# sourceMappingURL=temoinage.repository.js.map