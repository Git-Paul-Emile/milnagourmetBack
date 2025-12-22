import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { usersData } from './data/users.js';

export async function seedUsers(prisma: PrismaClient, zoneIdMap: { [key: string]: number }) {
  console.log('👥 Création des utilisateurs...');

  const userIdMap: { [key: string]: number } = {};
  const roleMap: { [key: string]: string } = {
    'admin': 'ADMIN',
    'client': 'CLIENT'
  };

  for (const user of usersData) {
    const userRole = roleMap[user.role as keyof typeof roleMap] || 'CLIENT';
    // Hasher le mot de passe en clair
    const hashedPassword = await bcrypt.hash((user as any).password || 'defaultpassword', 10);

    // Récupérer l'ID de la zone de livraison si elle existe
    const zoneLivraisonId = (user as any).zoneLivraisonId ? zoneIdMap[(user as any).zoneLivraisonId] : null;

    const createdUser = await prisma.utilisateur.upsert({
      where: { telephone: user.phone },
      update: {},
      create: {
        nomComplet: user.name,
        telephone: user.phone,
        password: hashedPassword,
        role: userRole as any,
        tokenVersion: 0,
        zoneLivraisonId: zoneLivraisonId
      }
    });
    userIdMap[user.id] = createdUser.id;
  }

  return userIdMap;
}