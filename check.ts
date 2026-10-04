import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.commande.findMany({
    orderBy: { id: 'desc' },
    take: 5,
    select: { id: true, notificationEnvoyee: true, notificationCanal: true, notificationErreur: true }
  });
  console.log(orders);
}
main().finally(() => prisma.$disconnect());
