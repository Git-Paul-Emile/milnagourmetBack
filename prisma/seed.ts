import { PrismaClient } from '@prisma/client';
import { seedCategories } from './seeds/categories.seed.js';
import { seedProducts } from './seeds/products.seed.js';
import { seedCreationOptions } from './seeds/creation-options.seed.js';
import { seedUsers } from './seeds/users.seed.js';
import { seedDelivery } from './seeds/delivery.seed.js';
import { seedTestimonials } from './seeds/testimonials.seed.js';
import { seedContact } from './seeds/contact.seed.js';
import { seedOrders } from './seeds/orders.seed.js';
import { seedSiteContent } from './seeds/site-content.seed.js';
import { seedConfigurations } from './seeds/configurations.seed.js';
import { seedServices } from './seeds/services.seed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Vider les tables existantes pour éviter les conflits
  console.log('🗑️ Vidage des tables existantes...');
  await prisma.elementCommande.deleteMany();
  await prisma.creationPersonnalisee.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.elementPanier.deleteMany();
  await prisma.creationPanier.deleteMany();
  await prisma.panier.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.livreur.deleteMany();
  await prisma.zoneLivraison.deleteMany();
  await prisma.temoinage.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.horaireOuverture.deleteMany();
  await prisma.reseauSocial.deleteMany();
  await prisma.marque.deleteMany();
  await prisma.sectionHero.deleteMany();
  await prisma.caracteristiqueHero.deleteMany();
  await prisma.sectionCatalogue.deleteMany();
  await prisma.navigation.deleteMany();
  await prisma.configurationStatut.deleteMany();
  await prisma.traductionCategorie.deleteMany();
  await prisma.categorieProduitItem.deleteMany();
  await prisma.composantService.deleteMany();
  await prisma.serviceSpecial.deleteMany();
  await prisma.produit.deleteMany();
  await prisma.tailleCreation.deleteMany();
  await prisma.traductionTaille.deleteMany();
  await prisma.fruit.deleteMany();
  await prisma.sauce.deleteMany();
  await prisma.cereale.deleteMany();
  await prisma.fruitCreation.deleteMany();
  await prisma.sauceCreation.deleteMany();
  await prisma.cerealeCreation.deleteMany();

  // Seed in order
  await seedCategories(prisma);
  const productIdMap = await seedProducts(prisma);
  const { tailleIdMap, fruitIdMap, sauceIdMap, cerealeIdMap } = await seedCreationOptions(prisma);
  const { zoneIdMap, livreurIdMap } = await seedDelivery(prisma);
  const userIdMap = await seedUsers(prisma, zoneIdMap);
  await seedTestimonials(prisma);
  await seedContact(prisma);
  await seedOrders(prisma, userIdMap, productIdMap, tailleIdMap, fruitIdMap, sauceIdMap, cerealeIdMap, zoneIdMap, livreurIdMap);
  await seedSiteContent(prisma);
  await seedConfigurations(prisma);
  await seedServices(prisma);

  console.log('✅ Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });