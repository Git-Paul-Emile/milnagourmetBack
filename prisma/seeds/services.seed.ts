import { PrismaClient } from '@prisma/client';
import { cloudinaryUrl } from '../../src/config/cloudinary.js';

// Vignette d'un élément de service : fichier déposé à la racine du projet,
// téléversé sur Cloudinary sous le dossier "service-components".
const componentImg = (basename: string) => cloudinaryUrl(`service-components/${basename}`);

// Image de couverture d'une carte service (dossier "service-covers").
const coverImg = (basename: string) => cloudinaryUrl(`service-covers/${basename}`);

// Nom d'élément -> image (mêmes noms pour les paniers et les boîtes).
const COMPONENT_IMAGES: Record<string, string> = {
  'Pâté': componentImg('pate.png'),
  'Fromage': componentImg('fromage.png'),
  'Jus de fruits': componentImg('jus_fruit.png'),
  'Fruits': componentImg('fruit.png'),
  'Madeleine': componentImg('madeleine.png'),
  'Pancake': componentImg('pancake.png'),
  'Crêpe': componentImg('crepe.png'),
};

/**
 * Seed des services spéciaux — 4 services, chacun avec sa logique :
 *
 * 1. Panier Cadeau (PANIER_FIXE)      : éléments par défaut non modifiables.
 * 2. Panier Personnalisé (PANIER_PERSO): mêmes défauts, désélectionnables,
 *    plus des éléments libres saisis par le client.
 * 3. Boîte Mono Saveur (MONO_SAVEUR)  : UNE gourmandise au choix, min 10 pièces.
 * 4. Boîte Découverte (ASSORTIMENT)   : quantité par gourmandise, augmentable
 *    mais jamais en dessous du défaut (crêpe 4, autres 3).
 *
 * Prix : paniers à partir de 25 000 FCFA (ajusté ensuite par le vendeur) ;
 * boîtes sur devis. Chaque service est adossé à un produit caché pour les
 * lignes de commande.
 */
export async function seedServices(prisma: PrismaClient) {
  console.log('🎁 Création des services spéciaux...');

  type ComposantDef = { nom: string; parDefaut?: boolean; quantiteDefaut?: number };
  const defs: {
    code: string;
    nom: string;
    description: string;
    typeService: string;
    prixBase: number;
    minElements: number;
    image?: string;
    covers?: string[];
    composants: ComposantDef[];
  }[] = [
    {
      code: 'panier-cadeau',
      nom: 'Panier Cadeau',
      description: 'Des paniers prêts à offrir.',
      typeService: 'PANIER_FIXE',
      prixBase: 25000,
      minElements: 1,
      image: coverImg('panier_cadeau_cover.png'),
      composants: [
        { nom: 'Pâté', parDefaut: true },
        { nom: 'Fromage', parDefaut: true },
        { nom: 'Jus de fruits', parDefaut: true },
        { nom: 'Fruits', parDefaut: true },
      ],
    },
    {
      code: 'panier-personnalise',
      nom: 'Panier Personnalisé',
      description: 'Créez votre panier selon vos envies.',
      typeService: 'PANIER_PERSO',
      prixBase: 25000,
      minElements: 1,
      image: coverImg('panier_cadeau_cover.png'),
      composants: [
        { nom: 'Pâté', parDefaut: true },
        { nom: 'Fromage', parDefaut: true },
        { nom: 'Jus de fruits', parDefaut: true },
        { nom: 'Fruits', parDefaut: true },
      ],
    },
    {
      code: 'boite-mono-saveur',
      nom: 'Boîte Mono Saveur',
      description: 'Une seule gourmandise dans la boîte.',
      typeService: 'MONO_SAVEUR',
      prixBase: 0, // sur devis
      minElements: 10, // quantité minimum de la gourmandise choisie
      // Rotation automatique sur la carte : crêpe, pancake, madeleine.
      image: coverImg('crepe_cover.png'),
      covers: [
        coverImg('crepe_cover.png'),
        coverImg('pank_cake_cover.png'),
        coverImg('madeleine_cover.png'),
      ],
      composants: [
        { nom: 'Madeleine' },
        { nom: 'Pancake' },
        { nom: 'Crêpe' },
      ],
    },
    {
      code: 'boite-decouverte',
      nom: 'Boîte Découverte',
      description: 'Un assortiment de plusieurs gourmandises.',
      typeService: 'ASSORTIMENT',
      prixBase: 0, // sur devis
      minElements: 1,
      image: coverImg('boite_mixte.png'),
      composants: [
        { nom: 'Crêpe', quantiteDefaut: 4 },
        { nom: 'Madeleine', quantiteDefaut: 3 },
        { nom: 'Pancake', quantiteDefaut: 3 },
      ],
    },
  ];

  for (const def of defs) {
    const produit = await prisma.produit.create({
      data: {
        nom: def.nom,
        categorie: 'CREATION',
        categorieId: null,
        prix: def.prixBase, // 0 = sur devis ; sinon prix de départ
        description: def.description,
        image: def.image ?? null,
        disponible: true,
      },
    });

    const service = await prisma.serviceSpecial.create({
      data: {
        code: def.code,
        nom: def.nom,
        description: def.description,
        image: def.image ?? null,
        covers: def.covers ?? [],
        actif: true,
        typeService: def.typeService,
        prixBase: def.prixBase,
        minElements: def.minElements,
        produitId: produit.id,
      },
    });

    for (const c of def.composants) {
      await prisma.composantService.create({
        data: {
          serviceId: service.id,
          nom: c.nom,
          image: COMPONENT_IMAGES[c.nom] ?? null,
          parDefaut: c.parDefaut ?? false,
          quantiteDefaut: c.quantiteDefaut ?? 0,
        },
      });
    }
  }

  console.log('✅ Services spéciaux créés (4 services)');
}
