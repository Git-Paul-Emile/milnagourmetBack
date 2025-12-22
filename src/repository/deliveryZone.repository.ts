import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DeliveryZoneRepository {
  async findAll() {
    return await prisma.zoneLivraison.findMany({
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findById(id: number) {
    return await prisma.zoneLivraison.findUnique({
      where: { id }
    });
  }

  async create(data: {
    nom: string;
    fraisLivraison: number;
    tempsEstime: string;
    active?: boolean;
  }) {
    return await prisma.zoneLivraison.create({
      data: {
        nom: data.nom,
        fraisLivraison: data.fraisLivraison,
        tempsEstime: data.tempsEstime,
        active: data.active
      }
    });
  }

  async update(id: number, data: {
    nom?: string;
    fraisLivraison?: number;
    tempsEstime?: string;
    active?: boolean;
  }) {
    return await prisma.zoneLivraison.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return await prisma.zoneLivraison.delete({
      where: { id }
    });
  }

  async findAllActive() {
    return await prisma.zoneLivraison.findMany({
      where: { active: true },
      orderBy: {
        nom: 'asc'
      }
    });
  }

  async findAllWithOrderCounts() {
    const result = await prisma.$queryRaw`
      SELECT
        z.id,
        z.nom,
        z.fraisLivraison,
        z.tempsEstime,
        z.active,
        z.creeLe,
        COUNT(o.id) as orderCount,
        COALESCE(SUM(o.montantTotal), 0) as totalRevenue
      FROM delivery_zones z
      LEFT JOIN users u ON z.id = u.zoneLivraisonId
      LEFT JOIN orders o ON u.id = o.utilisateurId
      GROUP BY z.id, z.nom, z.fraisLivraison, z.tempsEstime, z.active, z.creeLe
      ORDER BY z.nom ASC
    `;

    return result as Array<{
      id: number;
      nom: string;
      fraisLivraison: number;
      tempsEstime: string;
      active: boolean;
      creeLe: Date;
      orderCount: bigint;
      totalRevenue: bigint;
    }>;
  }
}

export default new DeliveryZoneRepository();