import { PrismaClient } from '@prisma/client';
import { heroData, catalogData, navigationData, brandingData, avatarToastData, bannerData } from './data/site-content.js';

export async function seedSiteContent(prisma: PrismaClient) {
  // Seed branding
  console.log('🎨 Création du branding...');
  await prisma.marque.upsert({
    where: { id: 1 },
    update: {},
    create: {
      logo: brandingData.logo
    }
  });

  // Seed avatar toast
  console.log('🖼️ Création de l\'avatar pour les toasts...');
  await prisma.avatarToast.upsert({
    where: { id: 1 },
    update: {},
    create: {
      image: avatarToastData.image
    }
  });

  // Seed hero section
  console.log('🚀 Création de la section Hero...');
  const hero = await prisma.sectionHero.upsert({
    where: { id: 1 },
    update: {},
    create: {
      banner: heroData.banner
    } as any
  });

  // Hero features
  for (let i = 0; i < heroData.features.length; i++) {
    const feature = heroData.features[i];
    if (feature) {
      await prisma.caracteristiqueHero.upsert({
        where: { id: i + 1 },
        update: {},
        create: {
          heroId: hero.id,
          titre: feature.title,
          description: feature.description,
          ordre: i
        }
      });
    }
  }

  // Seed catalog section
  console.log('📚 Création de la section Catalogue...');
  await prisma.sectionCatalogue.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titre: catalogData.title,
      description: catalogData.description,
      titreCreation: catalogData.creationTitle,
      descriptionCreation: catalogData.creationDescription,
      boutonCreation: catalogData.creationButtonText,
      imageCreation: catalogData.creationImage,
      messageVide: catalogData.emptyMessage,
      messageVideSecondaire: catalogData.emptySubMessage
    }
  });

  // Seed navigation
  console.log('🧭 Création de la navigation...');
  for (const navItem of navigationData) {
    await prisma.navigation.upsert({
      where: { id: navItem.order },
      update: {},
      create: {
        nom: navItem.name,
        href: navItem.href,
        ordre: navItem.order,
        active: navItem.active
      }
    });
  }
}