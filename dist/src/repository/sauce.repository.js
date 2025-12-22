import { prisma } from "../config/database.js";
class SauceRepository {
    async create(data) {
        try {
            const sauce = await prisma.sauce.create({ data });
            return sauce;
        }
        catch (error) {
            console.error('Erreur lors de la création de la sauce:', error);
            throw new Error('Impossible de créer la sauce');
        }
    }
    async findAll() {
        try {
            const sauces = await prisma.sauce.findMany({
                where: { disponible: true },
                orderBy: { ordreAffichage: 'asc' }
            });
            return sauces;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des sauces:', error);
            throw new Error('Impossible de récupérer les sauces');
        }
    }
    async findById(id) {
        try {
            const sauce = await prisma.sauce.findUnique({
                where: { id }
            });
            return sauce;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la sauce:', error);
            throw new Error('Impossible de récupérer la sauce');
        }
    }
    async update(id, data) {
        try {
            const sauce = await prisma.sauce.update({
                where: { id },
                data
            });
            return sauce;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de la sauce:', error);
            throw new Error('Impossible de mettre à jour la sauce');
        }
    }
    async delete(id) {
        try {
            const sauce = await prisma.sauce.delete({
                where: { id }
            });
            return sauce;
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la sauce:', error);
            throw new Error('Impossible de supprimer la sauce');
        }
    }
}
export default new SauceRepository();
//# sourceMappingURL=sauce.repository.js.map