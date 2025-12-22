import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { jsonResponse } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Chemin vers le dossier assets du front
const frontAssetsPath = path.join(__dirname, '../../../front/src/assets');
const prisma = new PrismaClient();
// Chemin vers le dossier des témoignages
const testimonialsPath = path.join(frontAssetsPath, 'temoignages');
// Chemin vers le dossier des produits
const productsPath = path.join(frontAssetsPath, 'produits');
// Chemin vers le dossier des logos
const logosPath = path.join(frontAssetsPath, 'logos');
// Chemin vers le dossier des bannières
const bannersPath = path.join(frontAssetsPath, 'banners');
// Chemin vers le dossier des créations
const creationsPath = path.join(frontAssetsPath, 'creation');
// Configuration de multer pour sauvegarder dans front/src/assets
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(frontAssetsPath)) {
            fs.mkdirSync(frontAssetsPath, { recursive: true });
        }
        cb(null, frontAssetsPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configuration de multer pour les témoignages
const testimonialsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(testimonialsPath)) {
            fs.mkdirSync(testimonialsPath, { recursive: true });
        }
        cb(null, testimonialsPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour les témoignages
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configuration de multer pour les produits
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(productsPath)) {
            fs.mkdirSync(productsPath, { recursive: true });
        }
        cb(null, productsPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour les produits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configuration de multer pour les logos
const logosStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(logosPath)) {
            fs.mkdirSync(logosPath, { recursive: true });
        }
        cb(null, logosPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour les logos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
// Configuration de multer pour les bannières
const bannersStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(bannersPath)) {
            fs.mkdirSync(bannersPath, { recursive: true });
        }
        cb(null, bannersPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour les bannières
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/[^a-z0-9]/g, '-') // Remplacer les caractères spéciaux par des tirets
            .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
            .replace(/^-|-$/g, ''); // Supprimer les tirets en début/fin
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
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
const uploadTestimonialImage = multer({
    storage: testimonialsStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
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
const uploadProductImage = multer({
    storage: productsStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
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
const uploadLogoImage = multer({
    storage: logosStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
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
const uploadBannerImage = multer({
    storage: bannersStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accepter seulement les images
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
    // Méthode helper pour récupérer les images utilisées
    async getUsedImagesList() {
        const usedImages = [];
        // Images des produits
        const products = await prisma.produit.findMany({
            select: { image: true }
        });
        console.log('Produits trouvés:', products);
        products.forEach(product => {
            if (product.image && product.image.startsWith('/src/assets/produits/')) {
                usedImages.push(product.image);
            }
        });
        // Logo du branding
        const branding = await prisma.marque.findFirst({
            select: { logo: true }
        });
        console.log('Branding trouvé:', branding);
        if (branding?.logo && branding.logo.startsWith('/src/assets/logos/')) {
            usedImages.push(branding.logo);
        }
        // Images des témoignages actifs
        const testimonials = await prisma.temoinage.findMany({
            where: { active: true },
            select: { avatar: true }
        });
        console.log('Témoignages actifs trouvés:', testimonials);
        testimonials.forEach(testimonial => {
            if (testimonial.avatar && testimonial.avatar.startsWith('/src/assets/')) {
                usedImages.push(testimonial.avatar);
            }
        });
        // Bannière de la section Hero
        const hero = await prisma.sectionHero.findFirst({
            select: { banner: true }
        });
        console.log('Section Hero trouvée:', hero);
        if (hero?.banner && hero.banner.startsWith('/src/assets/')) {
            usedImages.push(hero.banner);
        }
        // Images des fruits
        const fruits = await prisma.fruit.findMany({
            select: { image: true }
        });
        console.log('Fruits trouvés:', fruits);
        fruits.forEach(fruit => {
            if (fruit.image && fruit.image.startsWith('/src/assets/')) {
                usedImages.push(fruit.image);
            }
        });
        // Images des sauces
        const sauces = await prisma.sauce.findMany({
            select: { image: true }
        });
        sauces.forEach(sauce => {
            if (sauce.image && sauce.image.startsWith('/src/assets/')) {
                usedImages.push(sauce.image);
            }
        });
        // Images des céréales
        const cereales = await prisma.cereale.findMany({
            select: { image: true }
        });
        cereales.forEach(cereale => {
            if (cereale.image && cereale.image.startsWith('/src/assets/')) {
                usedImages.push(cereale.image);
            }
        });
        // Image de création du catalogue
        const catalog = await prisma.sectionCatalogue.findFirst({
            select: { imageCreation: true }
        });
        console.log('Catalogue trouvé:', catalog);
        if (catalog?.imageCreation && catalog.imageCreation.startsWith('/src/assets/creation/')) {
            usedImages.push(catalog.imageCreation);
        }
        // Supprimer les doublons
        const uniqueUsedImages = [...new Set(usedImages)];
        return uniqueUsedImages;
    }
    // Upload d'une image de produit
    async uploadProductImage(req, res, next) {
        try {
            const uploadSingle = uploadProductImage.single('image');
            uploadSingle(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                                status: 'error',
                                message: 'Le fichier est trop volumineux (max 5MB)'
                            }));
                        }
                    }
                    return next(err);
                }
                if (!req.file) {
                    return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                        status: 'error',
                        message: 'Aucun fichier fourni'
                    }));
                }
                // Retourner le chemin de l'image
                const imagePath = `/src/assets/produits/${req.file.filename}`;
                res.status(StatusCodes.OK).json(jsonResponse({
                    status: 'success',
                    message: 'Image uploadée avec succès',
                    data: {
                        path: imagePath,
                        filename: req.file.filename
                    }
                }));
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Upload d'une image de logo
    async uploadLogoImage(req, res, next) {
        try {
            const uploadSingle = uploadLogoImage.single('image');
            uploadSingle(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                                status: 'error',
                                message: 'Le fichier est trop volumineux (max 5MB)'
                            }));
                        }
                    }
                    return next(err);
                }
                if (!req.file) {
                    return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                        status: 'error',
                        message: 'Aucun fichier fourni'
                    }));
                }
                // Retourner le chemin de l'image
                const imagePath = `/src/assets/logos/${req.file.filename}`;
                res.status(StatusCodes.OK).json(jsonResponse({
                    status: 'success',
                    message: 'Image de logo uploadée avec succès',
                    data: {
                        path: imagePath,
                        filename: req.file.filename
                    }
                }));
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Upload d'une image de bannière
    async uploadBannerImage(req, res, next) {
        try {
            const uploadSingle = uploadBannerImage.single('image');
            uploadSingle(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                                status: 'error',
                                message: 'Le fichier est trop volumineux (max 5MB)'
                            }));
                        }
                    }
                    return next(err);
                }
                if (!req.file) {
                    return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                        status: 'error',
                        message: 'Aucun fichier fourni'
                    }));
                }
                // Retourner le chemin de l'image
                const imagePath = `/src/assets/banners/${req.file.filename}`;
                res.status(StatusCodes.OK).json(jsonResponse({
                    status: 'success',
                    message: 'Image de bannière uploadée avec succès',
                    data: {
                        path: imagePath,
                        filename: req.file.filename
                    }
                }));
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Upload d'une image de témoignage
    async uploadTestimonialImage(req, res, next) {
        try {
            const uploadSingle = uploadTestimonialImage.single('image');
            uploadSingle(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                                status: 'error',
                                message: 'Le fichier est trop volumineux (max 5MB)'
                            }));
                        }
                    }
                    return next(err);
                }
                if (!req.file) {
                    return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                        status: 'error',
                        message: 'Aucun fichier fourni'
                    }));
                }
                // Retourner le chemin de l'image pour les témoignages
                const imagePath = `/src/assets/temoignages/${req.file.filename}`;
                res.status(StatusCodes.OK).json(jsonResponse({
                    status: 'success',
                    message: 'Image de témoignage uploadée avec succès',
                    data: {
                        path: imagePath,
                        filename: req.file.filename
                    }
                }));
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Récupérer les images utilisées
    getUsedImages = async (req, res, next) => {
        try {
            const uniqueUsedImages = await this.getUsedImagesList();
            console.log('Images utilisées retournées:', uniqueUsedImages);
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
    // Supprimer une image
    deleteImage = async (req, res, next) => {
        try {
            const { folder, filename } = req.params;
            if (!folder || !filename) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Dossier et nom de fichier requis'
                }));
            }
            const imagePath = `/src/assets/${folder}/${filename}`;
            // Vérifier si l'image est utilisée
            const usedImages = await this.getUsedImagesList();
            if (usedImages.includes(imagePath)) {
                return res.status(StatusCodes.BAD_REQUEST).json(jsonResponse({
                    status: 'error',
                    message: 'Impossible de supprimer cette image car elle est actuellement utilisée sur le site'
                }));
            }
            const filePath = path.join(frontAssetsPath, folder, filename);
            // Vérifier si le fichier existe
            if (!fs.existsSync(filePath)) {
                return res.status(StatusCodes.NOT_FOUND).json(jsonResponse({
                    status: 'error',
                    message: 'Image non trouvée'
                }));
            }
            // Supprimer le fichier
            fs.unlinkSync(filePath);
            res.status(StatusCodes.OK).json(jsonResponse({
                status: 'success',
                message: 'Image supprimée avec succès'
            }));
        }
        catch (error) {
            next(error);
        }
    };
    // Lister les images disponibles dans src/assets
    listImages = async (req, res, next) => {
        try {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const allImages = [];
            // Récupérer les images utilisées
            const usedImages = await this.getUsedImagesList();
            // Fonction helper pour lire les images d'un dossier
            const getImagesFromDir = (dirPath, basePath) => {
                if (!fs.existsSync(dirPath))
                    return;
                const files = fs.readdirSync(dirPath);
                const images = files
                    .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return imageExtensions.includes(ext);
                })
                    .map(file => {
                    const imagePath = `${basePath}/${file}`;
                    // Créer un label à partir du nom de fichier (sans extension, formaté)
                    const nameWithoutExt = path.basename(file, path.extname(file))
                        .replace(/-/g, ' ')
                        .replace(/\d+/g, '')
                        .trim()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ') || file;
                    return {
                        value: imagePath,
                        label: nameWithoutExt || file,
                        isUsed: usedImages.includes(imagePath)
                    };
                });
                allImages.push(...images);
            };
            // Lire les images des logos
            getImagesFromDir(logosPath, '/src/assets/logos');
            // Lire les images des bannières
            getImagesFromDir(bannersPath, '/src/assets/banners');
            // Lire les images des créations
            getImagesFromDir(creationsPath, '/src/assets/creation');
            // Trier par label
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