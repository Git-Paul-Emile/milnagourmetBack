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
      description:
        "Panier garni à composer : formule basique (vin, pâté, fromage, confiture, amuse-gueule, jus de fruits, fruits) ou personnalisée selon vos envies. Le prix vous est communiqué par le vendeur après réception de la commande.",
      image: cloudinaryUrl('services/panier-gourmand.jpg'),
      minElements: 3,
      composants: ['Bouteille de vin', 'Pâté', 'Fromage', 'Confiture', 'Amuse-gueule', 'Jus de fruits', 'Fruits'],
    },
    {
      code: 'pancake',
      nom: 'Boîte pancake',
      description:
        "Boîte de pancakes maison (minimum 10 pièces). Service ponctuel selon disponibilité. Le prix vous est communiqué par le vendeur après réception de la commande.",
      image: cloudinaryUrl('services/boite-pancake.jpg'),
      minElements: 10,
      composants: [] as string[],
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
