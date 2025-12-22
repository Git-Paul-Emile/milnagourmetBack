import { PrismaClient } from '@prisma/client';
import { ordersData } from './data/orders.js';
export async function seedOrders(prisma, userIdMap, productIdMap, tailleIdMap, fruitIdMap, sauceIdMap, cerealeIdMap, zoneIdMap, livreurIdMap) {
    console.log('📦 Création des commandes...');
    for (const order of ordersData) {
        const dbUserId = order.userId ? userIdMap[order.userId] : null;
        // Récupérer le livreur ID
        const livreurId = order.deliveryPersonId ? livreurIdMap[order.deliveryPersonId] : null;
        const orderId = parseInt(order.id.split('-')[1] || '0');
        const createdOrder = await prisma.commande.upsert({
            where: { id: orderId },
            update: {},
            create: {
                utilisateurId: dbUserId,
                nomClient: order.customerName,
                telephoneClient: order.customerPhone,
                statut: order.status,
                montantTotal: order.totalAmount,
                fraisLivraison: order.deliveryFee,
                notes: order.notes,
                livreurId: livreurId,
                creeLe: new Date(order.createdAt),
                modifieLe: new Date(order.updatedAt)
            }
        });
        // Créer les éléments de commande
        for (const item of order.items) {
            const dbProductId = productIdMap[item.productId];
            if (!dbProductId)
                continue;
            await prisma.elementCommande.create({
                data: {
                    commandeId: createdOrder.id,
                    produitId: dbProductId,
                    quantite: item.quantity,
                    prix: item.price
                }
            });
        }
        // Créer les créations personnalisées
        for (const creation of order.customCreations) {
            const tailleId = tailleIdMap[creation.sizeId];
            if (!tailleId)
                continue;
            const createdCreation = await prisma.creationPersonnalisee.create({
                data: {
                    commandeId: createdOrder.id,
                    tailleId: tailleId,
                    quantite: creation.quantity,
                    prix: creation.price
                }
            });
            // Ajouter les fruits
            for (const fruitName of creation.fruits) {
                const fruitId = fruitIdMap[fruitName];
                if (fruitId) {
                    await prisma.fruitCreation.create({
                        data: {
                            creationPersonnaliseeId: createdCreation.id,
                            fruitId: fruitId
                        }
                    });
                }
            }
            // Ajouter les sauces
            for (const sauceName of creation.sauces) {
                const sauceId = sauceIdMap[sauceName];
                if (sauceId) {
                    await prisma.sauceCreation.create({
                        data: {
                            creationPersonnaliseeId: createdCreation.id,
                            sauceId: sauceId
                        }
                    });
                }
            }
            // Ajouter les céréales
            for (const cerealeName of creation.cereales) {
                const cerealeId = cerealeIdMap[cerealeName];
                if (cerealeId) {
                    await prisma.cerealeCreation.create({
                        data: {
                            creationPersonnaliseeId: createdCreation.id,
                            cerealeId: cerealeId
                        }
                    });
                }
            }
        }
    }
}
//# sourceMappingURL=orders.seed.js.map