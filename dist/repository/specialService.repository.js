import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class SpecialServiceRepository {
    // Tous les services, avec composants et produit lié (admin)
    async findAll() {
        return await prisma.serviceSpecial.findMany({
            include: {
                composants: { orderBy: { nom: 'asc' } },
                produit: true,
            },
            orderBy: { id: 'asc' },
        });
    }
    // Services actifs uniquement, avec composants disponibles (public)
    async findActive() {
        return await prisma.serviceSpecial.findMany({
            where: { actif: true },
            include: {
                composants: { where: { disponible: true }, orderBy: { nom: 'asc' } },
                produit: true,
            },
            orderBy: { id: 'asc' },
        });
    }
    async findById(id) {
        return await prisma.serviceSpecial.findUnique({
            where: { id },
            include: { composants: true, produit: true },
        });
    }
    async update(id, data) {
        return await prisma.serviceSpecial.update({
            where: { id },
            data,
            include: { composants: true, produit: true },
        });
    }
    // --- Composants ---
    async createComposant(serviceId, nom) {
        return await prisma.composantService.create({ data: { serviceId, nom } });
    }
    async updateComposant(id, data) {
        return await prisma.composantService.update({ where: { id }, data });
    }
    async deleteComposant(id) {
        return await prisma.composantService.delete({ where: { id } });
    }
}
export default new SpecialServiceRepository();
//# sourceMappingURL=specialService.repository.js.map