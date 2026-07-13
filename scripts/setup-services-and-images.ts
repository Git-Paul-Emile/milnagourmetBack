/**
 * Script tout-en-un — à exécuter UNE FOIS depuis back/ :
 *   npx tsx scripts/setup-services-and-images.ts
 *
 * Ce qu'il fait (idempotent, ré-exécutable sans danger) :
 * 1. Upload les images de la racine du projet vers Cloudinary (comme le ferait l'admin)
 * 2. Associe chaque image à son produit en base (mapping validé le 13/07/2026)
 * 3. Remplace l'image par défaut des créations (milnacreation4 → creation/yogurt-creation,
 *    même public_id : l'URL existante DEFAULT_CREATION_IMAGE continue de fonctionner)
 * 4. Crée les 2 services spéciaux (Panier gourmand, Boîte pancake) + leurs produits cachés
 *    (prix 0 = sur devis) + les 7 composants du panier
 * 5. Supprime les images de la racine une fois uploadées (--keep-images pour les garder)
 *
 * Prérequis : .env avec DATABASE_URL et CLOUDINARY_URL, et la migration appliquée :
 *   npx prisma migrate deploy
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { uploadBufferToCloudinary } from '../src/config/cloudinary.js';

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..'); // racine du projet (milnagourmet2)
const KEEP_IMAGES = process.argv.includes('--keep-images');

// Mapping image racine → { dossier Cloudinary, public_id, noms de produits en base }
const PRODUCT_IMAGES: { file: string; folder: string; publicId: string; productNames: string[] }[] = [
  { file: 'gourmet.jpeg',          folder: 'produits', publicId: 'gourmet-cremeux',  productNames: ['Gourmet Nature', 'Gourmet Simple', 'Gourmet Céréales'] },
  { file: 'gourmet liquide.png',   folder: 'produits', publicId: 'gourmet-liquide',  productNames: ['Gourmet Vanille'] },
  { file: 'liquide bissap1.png',   folder: 'produits', publicId: 'liquide-bissap',   productNames: ['Gourmet Bissap'] },
  { file: 'liquide coco.png',      folder: 'produits', publicId: 'liquide-coco',     productNames: ['Gourmet Coco'] },
  { file: 'liquide couscous.png',  folder: 'produits', publicId: 'liquide-couscous', productNames: ['Gourmet Couscous'] },
  { file: 'lot de 10.jpeg',        folder: 'produits', publicId: 'lot-de-10',        productNames: ['Lot de 10 miniscrémeux simple', 'Lot de 10 miniscrémeux mixe'] },
];

// Image par défaut des créations : on ÉCRASE le public_id existant pour que
// l'URL DEFAULT_CREATION_IMAGE du front reste valide sans redéploiement.
const CREATION_IMAGE = { file: 'milnacreation4.jpeg', folder: 'creation', publicId: 'yogurt-creation' };

const SERVICE_IMAGES = [
  { file: 'panier.jpeg',  folder: 'services', publicId: 'panier-gourmand', code: 'panier' },
  { file: 'pancake.jpeg', folder: 'services', publicId: 'boite-pancake',  code: 'pancake' },
];

const PANIER_COMPOSANTS = [
  'Bouteille de vin',
  'Pâté',
  'Fromage',
  'Confiture',
  'Amuse-gueule',
  'Jus de fruits',
  'Fruits',
];

async function uploadRootImage(file: string, folder: string, publicId: string): Promise<string | null> {
  const filePath = resolve(ROOT, file);
  if (!existsSync(filePath)) {
    console.warn(`⚠️  Fichier introuvable, ignoré : ${file}`);
    return null;
  }
  const buffer = readFileSync(filePath);
  const { secure_url } = await uploadBufferToCloudinary(buffer, folder, publicId);
  console.log(`☁️  Uploadé : ${file} → ${secure_url}`);
  return secure_url;
}

async function main() {
  const uploadedFiles: string[] = [];

  // 1-2. Images produits
  for (const img of PRODUCT_IMAGES) {
    const url = await uploadRootImage(img.file, img.folder, img.publicId);
    if (!url) continue;
    uploadedFiles.push(img.file);
    for (const nom of img.productNames) {
      const result = await prisma.produit.updateMany({ where: { nom }, data: { image: url } });
      if (result.count > 0) {
        console.log(`   ✅ Image associée au produit « ${nom} »`);
      } else {
        console.warn(`   ⚠️  Produit introuvable en base : « ${nom} » (image uploadée mais non associée)`);
      }
    }
  }

  // 3. Image par défaut des créations (écrase le public_id existant)
  const creationUrl = await uploadRootImage(CREATION_IMAGE.file, CREATION_IMAGE.folder, CREATION_IMAGE.publicId);
  if (creationUrl) {
    uploadedFiles.push(CREATION_IMAGE.file);
    console.log('   ✅ Image par défaut des créations remplacée (URL inchangée pour le front)');
  }

  // 4. Services spéciaux
  const serviceDefs = [
    {
      code: 'panier',
      nom: 'Panier gourmand',
      description:
        "Panier garni à composer : formule basique (vin, pâté, fromage, confiture, amuse-gueule, jus de fruits, fruits) ou personnalisée selon vos envies. Le prix vous est communiqué par le vendeur après réception de la commande.",
      minElements: 3,
    },
    {
      code: 'pancake',
      nom: 'Boîte pancake',
      description:
        "Boîte de pancakes maison (minimum 10 pièces). Service ponctuel selon disponibilité. Le prix vous est communiqué par le vendeur après réception de la commande.",
      minElements: 10,
    },
  ];

  for (const def of serviceDefs) {
    const imgDef = SERVICE_IMAGES.find((s) => s.code === def.code)!;
    const imageUrl = await uploadRootImage(imgDef.file, imgDef.folder, imgDef.publicId);
    if (imageUrl) uploadedFiles.push(imgDef.file);

    // Produit caché lié (prix 0 = sur devis) — invisible au catalogue (categorieId null)
    let service = await prisma.serviceSpecial.findUnique({ where: { code: def.code } });
    let produitId = service?.produitId ?? null;
    if (!produitId) {
      const produit = await prisma.produit.create({
        data: {
          nom: def.nom,
          categorie: 'CREATION',
          categorieId: null,
          prix: 0,
          description: def.description,
          image: imageUrl,
          disponible: true,
        },
      });
      produitId = produit.id;
      console.log(`   ✅ Produit caché créé pour « ${def.nom} » (id ${produitId}, prix 0 = sur devis)`);
    }

    service = await prisma.serviceSpecial.upsert({
      where: { code: def.code },
      update: { ...(imageUrl ? { image: imageUrl } : {}) },
      create: {
        code: def.code,
        nom: def.nom,
        description: def.description,
        image: imageUrl,
        actif: true,
        minElements: def.minElements,
        produitId,
      },
    });
    console.log(`   ✅ Service « ${def.nom} » prêt (actif, min ${service.minElements} éléments)`);

    // Composants du panier (créés une seule fois)
    if (def.code === 'panier') {
      for (const nom of PANIER_COMPOSANTS) {
        const exists = await prisma.composantService.findFirst({ where: { serviceId: service.id, nom } });
        if (!exists) {
          await prisma.composantService.create({ data: { serviceId: service.id, nom } });
          console.log(`      ➕ Composant : ${nom}`);
        }
      }
    }
  }

  // 5. Suppression des images de la racine
  if (KEEP_IMAGES) {
    console.log('🗂  --keep-images : les fichiers de la racine sont conservés.');
  } else {
    for (const file of uploadedFiles) {
      unlinkSync(resolve(ROOT, file));
      console.log(`🗑  Supprimé de la racine : ${file}`);
    }
  }

  console.log('\n🎉 Terminé. Produits illustrés, services initialisés.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
