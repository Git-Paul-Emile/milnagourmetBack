import { PrismaClient } from '@prisma/client';
import { cloudinaryUrl } from '../../src/config/cloudinary.js';

/**
 * Seed des services spéciaux (Panier gourmand, Boîte pancake).
 * Prix sur devis : le vendeur communique le prix après réception de la commande.
 * Chaque service est adossé à un produit caché (prix 0) pour les lignes de commande.
 */
export async function seedServices(prisma: PrismaClient) {
  console.log('🎁 Création des services spéciaux...');

  const defs = [
    {
      code: 'panier',
      nom: 'Panier gourmand',
      description: 'Panier garni, composé ou à composer.',
      image: cloudinaryUrl('services/panier-gourmand.jpg'),
      minElements: 3,
      composants: ['Bouteille de vin', 'Pâté', 'Fromage', 'Confiture', 'Amuse-gueule', 'Jus de fruits', 'Fruits'],
    },
    {
      code: 'pancake',
      nom: 'Boîte pancake',
      description: 'Boîte de pancakes maison (minimum 10 pièces).',
      image: cloudinaryUrl('services/boite-pancake.jpg'),
      minElements: 10,
      composants: ['Pancake', 'Crêpes', 'Madeleine'],
    },
  ];

  for (const def of defs) {
    const produit = await prisma.produit.create({
      data: {
        nom: def.nom,
        categorie: 'CREATION',
        categorieId: null,
        prix: 0, // sur devis
        description: def.description,
        image: def.image,
        disponible: true,
      },
    });

    const service = await prisma.serviceSpecial.create({
      data: {
        code: def.code,
        nom: def.nom,
        description: def.description,
        image: def.image,
        actif: true,
        minElements: def.minElements,
        produitId: produit.id,
      },
    });

    for (const nom of def.composants) {
      await prisma.composantService.create({ data: { serviceId: service.id, nom } });
    }
  }

  console.log('✅ Services spéciaux créés');
}
