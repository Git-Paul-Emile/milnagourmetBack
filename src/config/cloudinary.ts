import { v2 as cloudinary } from 'cloudinary';
import './env.js'; // s'assure que dotenv a chargé CLOUDINARY_URL avant la config Cloudinary

// `true` force le SDK à relire process.env.CLOUDINARY_URL maintenant : sans ce forçage,
// un appel interne à config() déclenché par l'import du package le met en cache vide
// (avant que dotenv n'ait eu la main), et toutes les opérations échouent silencieusement.
cloudinary.config(true);
cloudinary.config({ secure: true });

// Dossier racine Cloudinary regroupant tous les médias de l'application
export const CLOUDINARY_ROOT_FOLDER = 'milnagourmet';

const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g');

export function sanitizeFileBaseName(originalName: string): string {
  const ext = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')) : '';
  return originalName
    .slice(0, originalName.length - ext.length)
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Cache-buster fixé au démarrage du process : un run de seed produit donc des
// URLs stables entre elles, mais un NOUVEAU run (après changement d'image)
// génère de NOUVELLES URLs. Cela contourne définitivement le cache CDN/navigateur,
// contrairement à l'invalidation Cloudinary qui est lente et peu fiable.
const CACHE_BUST = Date.now();

export function cloudinaryUrl(relativePublicId: string): string {
  const base = cloudinary.url(`${CLOUDINARY_ROOT_FOLDER}/${relativePublicId}`, {
    secure: true,
    analytics: false,    // retire le paramètre ?_a=… (variante de cache parasite)
    force_version: false, // retire le /v1/ figé de l'URL
  });
  return `${base}?v=${CACHE_BUST}`;
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${CLOUDINARY_ROOT_FOLDER}/${folder}`,
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        // Purge le cache du CDN quand on réécrit sur un public_id existant.
        // Sans cela, l'URL (identique) continue de servir l'ancienne image.
        invalidate: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Échec de l'upload Cloudinary"));
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export default cloudinary;
