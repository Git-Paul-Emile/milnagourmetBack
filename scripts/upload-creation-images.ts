/**
 * Téléverse les images des options de création (tailles, fruits, sauces)
 * depuis la racine du projet vers Cloudinary, sous le dossier
 * `milnagourmet/creation-options/`.
 *
 * À lancer UNE FOIS depuis back/ (idempotent, `overwrite: true`) :
 *   npx tsx scripts/upload-creation-images.ts
 *
 * Prérequis : `.env` avec un CLOUDINARY_URL valide (nouveau compte).
 *
 * Les public_id produits correspondent exactement aux URLs générées par
 * `cloudinaryUrl('creation-options/<fichier>.png')` dans le seed :
 *   fichier racine  fraise.png
 *   -> public_id    milnagourmet/creation-options/fraise
 *   -> URL          .../milnagourmet/creation-options/fraise.png
 * (l'extension est retirée du public_id, Cloudinary la restitue via le format)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import { uploadBufferToCloudinary } from '../src/config/cloudinary.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..'); // racine du projet (milnagourmet2)

// Toutes les images attendues par le seed, présentes à la racine du projet.
// `folder` est le sous-dossier Cloudinary (sous milnagourmet/).
const IMAGES: { file: string; folder: string }[] = [
  // Tailles
  { file: 'taille_moyenne.png', folder: 'creation-options' },
  { file: 'taille_maxi.png', folder: 'creation-options' },
  { file: 'lot_de_10.png', folder: 'creation-options' },
  // Fruits
  { file: 'fraise.png', folder: 'creation-options' },
  { file: 'mangue.png', folder: 'creation-options' },
  { file: 'kiwi.png', folder: 'creation-options' },
  { file: 'raisin.png', folder: 'creation-options' },
  { file: 'ananas.png', folder: 'creation-options' },
  { file: 'pasteque.png', folder: 'creation-options' },
  { file: 'fruit_passion.png', folder: 'creation-options' },
  // Sauces
  { file: 'abricot.png', folder: 'creation-options' },
  { file: 'cerise.png', folder: 'creation-options' },
  { file: 'miel.png', folder: 'creation-options' },
  // Image par défaut des créations dans le panier (remplace yogurt-creation)
  { file: 'image-creation-panier.png', folder: 'creation' },
  // Vignettes des éléments de service (composants des paniers et boîtes)
  { file: 'pate.png', folder: 'service-components' },
  { file: 'fromage.png', folder: 'service-components' },
  { file: 'jus_fruit.png', folder: 'service-components' },
  { file: 'fruit.png', folder: 'service-components' },
  { file: 'madeleine.png', folder: 'service-components' },
  { file: 'pancake.png', folder: 'service-components' },
  { file: 'crepe.png', folder: 'service-components' },
  // Images de couverture des cartes services (dossier service-covers).
  { file: 'crepe_cover.png', folder: 'service-covers' },      // Mono Saveur (rotation)
  { file: 'pank_cake_cover.png', folder: 'service-covers' },  // Mono Saveur (rotation)
  { file: 'madeleine_cover.png', folder: 'service-covers' },  // Mono Saveur (rotation)
  { file: 'boite_mixte.png', folder: 'service-covers' },      // Boîte Découverte
  // Couvertures des paniers (à déposer plus tard) :
  // { file: 'panier-cadeau.png', folder: 'service-covers' },
  // { file: 'panier-personnalise.png', folder: 'service-covers' },
];

async function main() {
  console.log('☁️  Upload des images de création vers Cloudinary...\n');
  let ok = 0;
  const missing: string[] = [];

  for (const { file, folder } of IMAGES) {
    const filePath = resolve(ROOT, file);
    if (!existsSync(filePath)) {
      missing.push(file);
      console.warn(`  ⚠️  introuvable : ${file}`);
      continue;
    }
    const publicId = parse(file).name; // sans extension
    const buffer = readFileSync(filePath);
    const result = await uploadBufferToCloudinary(buffer, folder, publicId);
    console.log(`  ✓ ${file}  ->  ${result.secure_url}`);
    ok++;
  }

  console.log(`\nTerminé : ${ok}/${IMAGES.length} image(s) téléversée(s).`);
  if (missing.length) {
    console.log(`Manquantes (${missing.length}) : ${missing.join(', ')}`);
    console.log('Place ces fichiers à la racine du projet puis relance le script.');
  }
}

main()
  .catch((err) => {
    console.error('Erreur pendant l’upload :', err);
    process.exit(1);
  });
