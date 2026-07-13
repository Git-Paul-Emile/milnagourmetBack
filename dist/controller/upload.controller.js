import multer from 'multer';
import path from 'path';
import { jsonResponse } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import cloudinary, { CLOUDINARY_ROOT_FOLDER, sanitizeFileBaseName, uploadBufferToCloudinary } from '../config/cloudinary.js';
const prisma = new PrismaClient();
// Dossiers Cloudinary (équivalents des anciens dossiers locaux uploads/*)
const FOLDERS = {
    produits: 'produits',
    logos: 'logos',
    banners: 'banners',
    temoignages: 'temoignages',
    categories: 'categories',
    fruits: 'fruits',
    sauces: 'sauces',
    cereales: 'cereales',
    avatarToast: 'avatarToast',
};
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
        }
    }
});
class UploadController {
    // Méthode helper pour récupérer les images utilisées (URLs Cloudinary stockées en DB)
    async getUsedImagesList() {
        const usedImages = [];
        const products = await prisma.produit.findMany({ select: { image: true } });
        products.forEach((product) => {
            if (product.image)
                usedImages.push(product.image);
        });
        const branding = await prisma.marque.findFirst({ select: { logo: true } });
        if (branding?.logo)
            usedImages.push(branding.logo);
        const testimonials = await prisma.temoinage.findMany({
            where: { active: true },
            select: { avatar: true }
        });
        testimonials.forEach((testimonial) => {
            if (testimonial.avatar)
                usedImages.push(testimonial.avatar);
        });
        const hero = await prisma.sectionHero.findFirst({ select: { banner: true } });
        if (hero?.banner)
            usedImages.push(hero.banner);
        const fruits = await prisma.fruit.findMany({ select: { image: true } });
        fruits.forEach((fruit) => {
            if (fruit.image)
                usedImages.push(fruit.image);
        });
        const sauces = await prisma.sauce.findMany({ select: { image: true } });
        sauces.forEach((sauce) => {
            if (sauce.image)
                usedImages.push(sauce.image);
        });
        const cereales = await prisma.cereale.findMany({ select: { image: true } });
        cereales.forEach((cereale) => {
            if (cereale.image)
                usedImages.push(cereale.image);
        });
        const catalog = await prisma.sectionCatalogue.findFirst({ select: { imageCreation: true } });
        if (catalog?.imageCreation)
            usedImages.push(catalog.imageCreation);
        const avatarToast = await prisma.avatarToast.findFirst({ select: { image: true } });
        if (avatarToast?.image)
            usedImages.push(avatarToast.image);
        return [...new Set(usedImages)];
    }
    // Upload générique vers Cloudinary : renvoie { path: secure_url, filename: public_id }
    handleUpload(folder, successMessage) {
        return (req, res, next) => {
            const uploadSingle = upload.single('image');
            uploadSingle(req, res, async (err) => {
                if (err) {
                    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({ status: 'error', message: 'Le fichier est trop volumineux (max 5MB)' }));
                    }
                    return next(err);
                }
                if (!req.file) {
                    return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({ status: 'error', message: 'Aucun fichier fourni' }));
                }
                try {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const baseName = sanitizeFileBaseName(req.file.originalname);
                    const publicId = `${baseName}-${uniqueSuffix}`;
                    const result = await uploadBufferToCloudinary(req.file.buffer, folder, publicId);
                    res.status(StatusCodes.OK).json(jsonResponse({
                        status: 'success',
                        message: successMessage,
                        data: {
                            path: result.secure_url,
                            filename: result.public_id
                        }
                    }));
                }
                catch (uploadError) {
                    next(uploadError);
                }
            });
        };
    }
    uploadProductImage = this.handleUpload(FOLDERS.produits, 'Image uploadée avec succès');
    uploadLogoImage = this.handleUpload(FOLDERS.logos, 'Image de logo uploadée avec succès');
    uploadBannerImage = this.handleUpload(FOLDERS.banners, 'Image de bannière uploadée avec succès');
    uploadTestimonialImage = this.handleUpload(FOLDERS.temoignages, 'Image de témoignage uploadée avec succès');
    uploadCategoryImage = this.handleUpload(FOLDERS.categories, 'Image de catégorie uploadée avec succès');
    uploadFruitImage = this.handleUpload(FOLDERS.fruits, 'Image de fruit uploadée avec succès');
    uploadSauceImage = this.handleUpload(FOLDERS.sauces, 'Image de sauce uploadée avec succès');
    uploadCerealeImage = this.handleUpload(FOLDERS.cereales, 'Image de céréale uploadée avec succès');
    uploadAvatarToastImage = this.handleUpload(FOLDERS.avatarToast, "Image d'avatar pour les toasts uploadée avec succès");
    // Récupérer les images utilisées
    getUsedImages = async (req, res, next) => {
        try {
            const uniqueUsedImages = await this.getUsedImagesList();
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${uniqueUsedImages.length} image(s) utilisée(s) trouvée(s)`,
                data: uniqueUsedImages
            }));
        }
        catch (error) {
            next(error);
        }
    };
    // Supprimer une image (par public_id Cloudinary)
    deleteImage = async (req, res, next) => {
        try {
            const publicId = typeof req.query.publicId === 'string' ? req.query.publicId : undefined;
            if (!publicId || !publicId.startsWith(`${CLOUDINARY_ROOT_FOLDER}/`)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({ status: 'error', message: 'Identifiant d\'image (publicId) requis' }));
            }
            const usedImages = await this.getUsedImagesList();
            const isUsed = usedImages.some((url) => url.includes(publicId));
            if (isUsed) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Impossible de supprimer cette image car elle est actuellement utilisée sur le site'
                }));
            }
            const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            if (result.result !== 'ok' && result.result !== 'not found') {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(jsonResponse({ status: 'error', message: 'Erreur lors de la suppression de l\'image' }));
            }
            if (result.result === 'not found') {
                return res.status(StatusCodes.NOT_FOUND).json(jsonResponse({ status: 'error', message: 'Image non trouvée' }));
            }
            res.status(StatusCodes.OK).json(jsonResponse({ status: 'success', message: 'Image supprimée avec succès' }));
        }
        catch (error) {
            next(error);
        }
    };
    // Lister les images disponibles sur Cloudinary
    listImages = async (req, res, next) => {
        try {
            const usedImages = await this.getUsedImagesList();
            const allImages = [];
            let nextCursor;
            do {
                const response = await cloudinary.api.resources({
                    type: 'upload',
                    prefix: `${CLOUDINARY_ROOT_FOLDER}/`,
                    max_results: 200,
                    next_cursor: nextCursor
                });
                for (const resource of response.resources) {
                    const publicId = resource.public_id;
                    const leaf = publicId.split('/').pop() || publicId;
                    const nameWithoutSuffix = leaf.replace(/-\d{13}-\d+$/, '');
                    const label = nameWithoutSuffix
                        .replace(/-/g, ' ')
                        .split(' ')
                        .filter(Boolean)
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ') || leaf;
                    allImages.push({
                        value: resource.secure_url,
                        label,
                        isUsed: usedImages.includes(resource.secure_url),
                        publicId
                    });
                }
                nextCursor = response.next_cursor;
            } while (nextCursor);
            allImages.sort((a, b) => a.label.localeCompare(b.label));
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: `${allImages.length} image(s) trouvée(s)`,
                data: allImages
            }));
        }
        catch (error) {
            next(error);
        }
    };
}
export default new UploadController();
//# sourceMappingURL=upload.controller.js.map