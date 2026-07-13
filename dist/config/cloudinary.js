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
export function sanitizeFileBaseName(originalName) {
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
export function cloudinaryUrl(relativePublicId) {
    return cloudinary.url(`${CLOUDINARY_ROOT_FOLDER}/${relativePublicId}`, { secure: true });
}
export function uploadBufferToCloudinary(buffer, folder, publicId) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: `${CLOUDINARY_ROOT_FOLDER}/${folder}`,
            public_id: publicId,
            resource_type: 'image',
            overwrite: true,
        }, (error, result) => {
            if (error || !result) {
                return reject(error ?? new Error("Échec de l'upload Cloudinary"));
            }
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
        });
        uploadStream.end(buffer);
    });
}
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map