import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { usersData } from './data/users.js';
export async function seedUsers(prisma, zoneIdMap) {
    console.log('👥 Création des utilisateurs...');
    const userIdMap = {};
    const roleMap = {
        'admin': 'ADMIN',
        'client': 'CLIENT'
    };
    for (const user of usersData) {
        const userRole = roleMap[user.role] || 'CLIENT';
        // Hasher le mot de passe en clair
        const hashedPassword = await bcrypt.hash(user.password || 'defaultpassword', 10);
        // Récupérer l'ID de la zone de livraison si elle existe
        const zoneLivraisonId = user.zoneLivraisonId ? zoneIdMap[user.zoneLivraisonId] : null;
        const createdUser = await prisma.utilisateur.upsert({
            where: { telephone: user.phone },
            update: {},
            create: {
                nomComplet: user.name,
                telephone: user.phone,
                password: hashedPassword,
                role: userRole,
                tokenVersion: 0,
                zoneLivraisonId: zoneLivraisonId
            }
        });
        userIdMap[user.id] = createdUser.id;
    }
    return userIdMap;
}
//# sourceMappingURL=users.seed.js.map