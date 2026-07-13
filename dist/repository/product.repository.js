import { prisma } from "../config/database.js";
class ProductRepository {
    async create(data) {
        try {
            const product = await prisma.produit.create({
                data,
                include: {
                    categorieProduit: true
                }
            });
            return product;
        }
        catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw new Error('Impossible de créer le produit');
        }
    }
    async findAll(options = {}) {
        try {
            const { page, limit, search, category, disponible, sortBy = 'date', sortOrder = 'desc' } = options;
            const where = {};
            if (category) {
                where.categorie = category;
            }
            if (disponible !== undefined) {
                where.disponible = disponible;
            }
            if (search) {
                where.OR = [
                    { nom: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ];
            }
            const orderByMap = {
                name: { nom: sortOrder },
                price: { prix: sortOrder },
                date: { creeLe: sortOrder }
            };
            const isPaginated = page !== undefined && limit !== undefined;
            const [products, total] = await Promise.all([
                prisma.produit.findMany({
                    where,
                    include: {
                        categorieProduit: true
                    },
                    orderBy: orderByMap[sortBy],
                    ...(isPaginated ? { skip: (page - 1) * limit, take: limit } : {})
                }),
                prisma.produit.count({ where })
            ]);
            return { items: products, total };
        }
        catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw new Error('Impossible de récupérer les produits');
        }
    }
    async findById(id) {
        try {
            const product = await prisma.produit.findUnique({
                where: { id },
                include: {
                    categorieProduit: true
                }
            });
            return product;
        }
        catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
            throw new Error('Impossible de récupérer le produit');
        }
    }
    async update(id, data) {
        try {
            const product = await prisma.produit.update({
                where: { id },
                data,
                include: {
                    categorieProduit: true
                }
            });
            return product;
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            throw new Error('Impossible de mettre à jour le produit');
        }
    }
    async delete(id) {
        try {
            const product = await prisma.produit.delete({
                where: { id },
                include: {
                    categorieProduit: true
                }
            });
            return product;
        }
        catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            throw new Error('Impossible de supprimer le produit');
        }
    }
}
export default new ProductRepository();
//# sourceMappingURL=product.repository.js.map