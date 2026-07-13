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

  async findById(id: number) {
    return await prisma.serviceSpecial.findUnique({
      where: { id },
      include: { composants: true, produit: true },
    });
  }

  async update(
    id: number,
    data: { nom?: string; description?: string; image?: string; actif?: boolean; minElements?: number }
  ) {
    return await prisma.serviceSpecial.update({
      where: { id },
      data,
      include: { composants: true, produit: true },
    });
  }

  // --- Composants ---
  async createComposant(serviceId: number, nom: string) {
    return await prisma.composantService.create({ data: { serviceId, nom } });
  }

  async updateComposant(id: number, data: { nom?: string; disponible?: boolean }) {
    return await prisma.composantService.update({ where: { id }, data });
  }

  async deleteComposant(id: number) {
    return await prisma.composantService.delete({ where: { id } });
  }
}

export default new SpecialServiceRepository();
