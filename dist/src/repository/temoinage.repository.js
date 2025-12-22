import { prisma } from "../config/database.js";
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
            console.error('Erreur lors de la récupération des témoignages:', error);
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
            console.error('Erreur lors de la récupération de tous les témoignages:', error);
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
            console.error('Erreur lors de la création du témoignage:', error);
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
            console.error('Erreur lors de la mise à jour du témoignage:', error);
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
            console.error('Erreur lors de la suppression du témoignage:', error);
            throw new Error('Impossible de supprimer le témoignage');
        }
    }
}
export default new TemoinageRepository();
//# sourceMappingURL=temoinage.repository.js.map