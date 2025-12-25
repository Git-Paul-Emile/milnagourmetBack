import { PrismaClient } from '@prisma/client';

export async function seedConfigurations(prisma: PrismaClient) {
  // Seed status configurations
  console.log('⚙️ Création des configurations de statuts...');
  const statusConfigs = [
    { statut: 'RECU' as const, libelleFr: 'Reçue', couleurBg: 'bg-blue-100', couleurText: 'text-blue-800', icone: 'CheckCircle', ordre: 1 },
    { statut: 'LIVREE' as const, libelleFr: 'Livrée', couleurBg: 'bg-purple-100', couleurText: 'text-purple-800', icone: 'CheckCircle', ordre: 2 },
    { statut: 'ANNULEE' as const, libelleFr: 'Annulée', couleurBg: 'bg-red-100', couleurText: 'text-red-800', icone: 'XCircle', ordre: 3 }
  ];

  for (const config of statusConfigs) {
    await prisma.configurationStatut.upsert({
      where: { statut: config.statut as any },
      update: {
        libelleFr: config.libelleFr,
        couleurBg: config.couleurBg,
        couleurText: config.couleurText,
        icone: config.icone,
        ordre: config.ordre
      },
      create: config as any
    });
  }

  // Seed category translations
  console.log('🌐 Création des traductions de catégories...');
  const productCategories = await prisma.categorieProduitItem.findMany();
  const categoryTranslations = [
    { code: 'cremeux', libelleFr: 'Crémeux' },
    { code: 'liquide', libelleFr: 'Liquide' },
    { code: 'creation', libelleFr: 'Création' }
  ];

  for (const category of productCategories) {
    const translation = categoryTranslations.find(t =>
      category.nom.toLowerCase().includes(t.code.toLowerCase())
    );
    if (translation) {
      await prisma.traductionCategorie.upsert({
        where: {
          categorieId_code: {
            categorieId: category.id,
            code: translation.code
          }
        },
        update: {
          libelleFr: translation.libelleFr
        },
        create: {
          categorieId: category.id,
          code: translation.code,
          libelleFr: translation.libelleFr
        }
      });
    }
  }

  // Seed size translations
  console.log('📏 Création des traductions de tailles...');
  const tailles = await prisma.tailleCreation.findMany();
  const sizeTranslations: Record<string, string> = {
    'moyen': 'Moyen',
    'maxi': 'Maxi',
    'petit': 'Petit',
    'grand': 'Grand'
  };

  for (const taille of tailles) {
    const nomLower = taille.nom.toLowerCase();
    const libelleFr = sizeTranslations[nomLower] || taille.nom.charAt(0).toUpperCase() + taille.nom.slice(1);

    await prisma.traductionTaille.upsert({
      where: {
        tailleId_code: {
          tailleId: taille.id,
          code: nomLower
        }
      },
      update: {
        libelleFr: libelleFr
      },
      create: {
        tailleId: taille.id,
        code: nomLower,
        libelleFr: libelleFr
      }
    });
  }
}