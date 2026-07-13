import { prisma } from "../config/database.js";
class UserRepository {
    async create(data) {
        try {
            const user = await prisma.utilisateur.create({
                data: {
                    telephone: data.telephone,
                    nomComplet: data.nomComplet,
                    zoneLivraisonId: data.zoneLivraisonId,
                    password: data.password, // Sera hashé dans le service
                    role: 'USER'
                }
            });
            return user;
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw new Error(`Impossible de créer l'utilisateur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    }
    async findAll(options = {}) {
        try {
            const { page, limit, search, blocked, sortBy = 'date', sortOrder = 'desc' } = options;
            const where = {
                // On exclut toujours les administrateurs de la liste des clients
                role: { not: 'ADMIN' }
            };
            if (blocked !== undefined) {
                where.blocked = blocked;
            }
            if (search) {
                where.OR = [
                    { nomComplet: { contains: search, mode: 'insensitive' } },
                    { telephone: { contains: search } }
                ];
            }
            const orderByMap = {
                name: { nomComplet: sortOrder },
                orders: { commandes: { _count: sortOrder } },
                date: { createdAt: sortOrder }
            };
            const isPaginated = page !== undefined && limit !== undefined;
            const [users, total] = await Promise.all([
                prisma.utilisateur.findMany({
                    where,
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
                    orderBy: orderByMap[sortBy],
                    ...(isPaginated ? { skip: (page - 1) * limit, take: limit } : {})
                }),
                prisma.utilisateur.count({ where })
            ]);
            return { items: users, total };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            throw new Error('Impossible de récupérer les utilisateurs');
        }
    }
    async findByPhone(telephone) {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { telephone },
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer l\'utilisateur');
        }
    }
    async findById(id) {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { id: parseInt(id) },
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw new Error('Impossible de récupérer l\'utilisateur');
        }
    }
    async update(id, data) {
        try {
            const user = await prisma.utilisateur.update({
                where: { id: parseInt(id) },
                data,
                include: {
                    zoneLivraison: true
                }
            });
            return user;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            throw error;
        }
    }
    async incrementTokenVersion(id) {
        try {
            const user = await prisma.utilisateur.update({
                where: { id: parseInt(id) },
                data: {
                    tokenVersion: {
                        increment: 1
                    }
                }
            });
            return user;
        }
        catch (error) {
            console.error('Erreur lors de l\'incrémentation de la version du token:', error);
            throw new Error('Impossible de mettre à jour la version du token');
        }
    }
    async delete(id) {
        try {
            await prisma.utilisateur.delete({
                where: { id: parseInt(id) }
            });
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw error;
        }
    }
}
export default new UserRepository();
//# sourceMappingURL=user.repository.js.map