/**
 * Migre les fichiers historiques de back/uploads/** vers Cloudinary, puis met à
 * jour les colonnes DB qui pointaient encore vers un chemin local "/uploads/...".
 *
 * Usage: pnpm run migrate:cloudinary  (nécessite un CLOUDINARY_URL complet dans .env)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import cloudinary, { CLOUDINARY_ROOT_FOLDER } from '../src/config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads');

const prisma = new PrismaClient();

async function uploadFile(folder: string, filePath: string, publicIdWithoutExt: string) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `${CLOUDINARY_ROOT_FOLDER}/${folder}`,
    public_id: publicIdWithoutExt,
    resource_type: 'image',
    overwrite: true,
    invalidate: true,
  });
  return result.secure_url;
}

async function updateReferencingRows(oldPath: string, newUrl: string) {
  let updated = 0;

  const produit = await prisma.produit.updateMany({ where: { image: oldPath }, data: { image: newUrl } });
  updated += produit.count;

  const marque = await prisma.marque.updateMany({ where: { logo: oldPath }, data: { logo: newUrl } });
  updated += marque.count;

  const temoinage = await prisma.temoinage.updateMany({ where: { avatar: oldPath }, data: { avatar: newUrl } });
  updated += temoinage.count;

  const hero = await prisma.sectionHero.updateMany({ where: { banner: oldPath }, data: { banner: newUrl } });
  updated += hero.count;

  const fruit = await prisma.fruit.updateMany({ where: { image: oldPath }, data: { image: newUrl } });
  updated += fruit.count;

  const sauce = await prisma.sauce.updateMany({ where: { image: oldPath }, data: { image: newUrl } });
  updated += sauce.count;

  const cereale = await prisma.cereale.updateMany({ where: { image: oldPath }, data: { image: newUrl } });
  updated += cereale.count;

  const catalogue = await prisma.sectionCatalogue.updateMany({ where: { imageCreation: oldPath }, data: { imageCreation: newUrl } });
  updated += catalogue.count;

  const avatarToast = await prisma.avatarToast.updateMany({ where: { image: oldPath }, data: { image: newUrl } });
  updated += avatarToast.count;

  return updated;
}

async function main() {
  if (!fs.existsSync(uploadsPath)) {
    console.log('Aucun dossier uploads local trouvé, rien à migrer.');
    return;
  }

  const folders = fs.readdirSync(uploadsPath).filter((f) => fs.statSync(path.join(uploadsPath, f)).isDirectory());
  const mapping: { oldPath: string; newUrl: string; rowsUpdated: number }[] = [];

  for (const folder of folders) {
    const folderPath = path.join(uploadsPath, folder);
    const files = fs.readdirSync(folderPath).filter((f) => fs.statSync(path.join(folderPath, f)).isFile());

    for (const file of files) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const filePath = path.join(folderPath, file);
      const oldPath = `/uploads/${folder}/${file}`;

      process.stdout.write(`Upload ${oldPath} -> Cloudinary...`);
      const newUrl = await uploadFile(folder, filePath, baseName);
      const rowsUpdated = await updateReferencingRows(oldPath, newUrl);
      console.log(` ok (${newUrl}) [${rowsUpdated} ligne(s) DB mise(s) à jour]`);

      mapping.push({ oldPath, newUrl, rowsUpdated });
    }
  }

  console.log('\nRécapitulatif de migration:');
  console.table(mapping);
}

main()
  .catch((error) => {
    console.error('Erreur durant la migration:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
