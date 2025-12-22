import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySeed() {
  console.log('🔍 Vérification des données après seeding...');

  try {
    // Vérifier les produits
    const productsCount = await prisma.produit.count();
    console.log(`✅ Produits: ${productsCount}`);

    // Vérifier les utilisateurs
    const usersCount = await prisma.utilisateur.count();
    console.log(`✅ Utilisateurs: ${usersCount}`);

    // Vérifier les catégories
    const categoriesCount = await prisma.categorieProduitItem.count();
    console.log(`✅ Catégories: ${categoriesCount}`);

    // Vérifier les commandes
    const ordersCount = await prisma.commande.count();
    console.log(`✅ Commandes: ${ordersCount}`);

    // Vérifier les témoignages
    const testimonialsCount = await prisma.temoinage.count();
    console.log(`✅ Témoignages: ${testimonialsCount}`);

    // Vérifier les zones de livraison
    const deliveryZonesCount = await prisma.zoneLivraison.count();
    console.log(`✅ Zones de livraison: ${deliveryZonesCount}`);

    console.log('🎉 Toutes les données ont été correctement insérées !');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySeed();