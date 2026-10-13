import { PrismaClient } from '@prisma/client';
import { seedProducts } from './seeds/products.seed.js';
import { seedTestimonials } from './seeds/testimonials.seed.js';
import { productsData } from './seeds/data/products.js';
import { testimonialsData } from './seeds/data/testimonials.js';

const prisma = new PrismaClient();

async function main() {
  const bissapSeed = productsData.find(product => product.id === 'liquide-bissap');
  const testimonialSeed = testimonialsData.find(testimonial => testimonial.id === 1);

  if (!bissapSeed || !testimonialSeed) {
    throw new Error('Les données de seed ciblées sont introuvables.');
  }

  console.log('🌱 Mise à jour ciblée des contenus géographiques...');
  await seedProducts(prisma, ['liquide-bissap']);
  await seedTestimonials(prisma, [1]);

  const [bissapProduct, testimonial] = await Promise.all([
    prisma.produit.findFirst({
      where: { nom: bissapSeed.name },
      select: { description: true }
    }),
    prisma.temoinage.findUnique({
      where: { id: testimonialSeed.id },
      select: { lieu: true, commentaire: true }
    })
  ]);

  if (
    bissapProduct?.description !== bissapSeed.description
    || testimonial?.lieu !== testimonialSeed.location
    || testimonial?.commentaire !== testimonialSeed.comment
  ) {
    throw new Error('La vérification des données géographiques mises à jour a échoué.');
  }

  console.log('✅ Mise à jour ciblée terminée.');
  console.log(`✅ Produit vérifié : ${bissapSeed.name}`);
  console.log(`✅ Témoignage vérifié : ${testimonialSeed.name} (${testimonialSeed.location})`);
}

main()
  .catch((error) => {
    console.error('❌ Erreur lors de la mise à jour ciblée :', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
